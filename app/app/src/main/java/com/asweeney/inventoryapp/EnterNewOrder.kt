package com.asweeney.inventoryapp

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import android.icu.util.Calendar
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.TextUtils
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts.StartActivityForResult
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonSerializer
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import com.google.gson.JsonObject

import com.google.gson.JsonSerializationContext

import com.google.gson.JsonElement




class EnterNewOrder : AppCompatActivity() {
    private val orderItems = ArrayList<OrderItem>()
    private val orderItemsAdapter = OrderItemAdapter(orderItems)
    private var orderNumber: String? = null
    private var resultLauncher = registerForActivityResult(StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val data = result.data?.getStringExtra("newItem")
            addItem(data!!)
        }
    }
	private lateinit var sharedPref: SharedPreferences
    private lateinit var accesstoken: String
    private lateinit var idtoken: String
    private lateinit var baseUrl: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_act_enter_new_order)

		sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
        accesstoken = sharedPref.getString("access_token", "NONE")!!
        idtoken = sharedPref.getString("id_token", "NONE")!!
        baseUrl = resources.getString(R.string.api_baseurl)

        setSpinner(true)
        CoroutineScope(Dispatchers.IO).launch { setSpinner() }
        loadRecycler(this)
        registerButtons()

    }

    private fun setSpinner(quick: Boolean = false){
        val context = this
        val spnVendor: Spinner = findViewById(R.id.spn_Vendor)
        val list = getVendors(quick)

        CoroutineScope(Dispatchers.IO).launch(Dispatchers.Main) {
            val adapter: ArrayAdapter<Vendor> = object : ArrayAdapter<Vendor>(
                context,
                android.R.layout.simple_spinner_dropdown_item,
                list
            ) {
                override fun getDropDownView(
                    position: Int,
                    convertView: View?,
                    parent: ViewGroup
                ): View {
                    val view: TextView = super.getDropDownView(
                        position,
                        convertView,
                        parent
                    ) as TextView
                    view.setTypeface(view.typeface, Typeface.BOLD)
                    if (position == spnVendor.selectedItemPosition && position != 0) {
                        view.background = ColorDrawable(Color.parseColor("#F7E7CE"))
                        view.setTextColor(Color.parseColor("#333399"))
                    }
                    if (position == 0) {
                        view.setTextColor(Color.LTGRAY)
                    }

                    return view
                }

                override fun isEnabled(position: Int): Boolean {
                    return position != 0
                }
            }
            spnVendor.adapter = adapter
        }
    }

    private fun getVendors(quick: Boolean = false): List<Vendor> {
        var list = ArrayList<Vendor>()
        if(!quick) {
            val job = CoroutineScope(Dispatchers.IO).launch {
                val api = APIClient(accesstoken, idtoken, baseUrl)
                val vendors = api.getVendors()

                val listType = object : TypeToken<ArrayList<Vendor?>?>() {}.type
                list = Gson().fromJson(vendors, listType)
            }
            runBlocking {
                job.join()
            }
        }
        list.add(0, Vendor(0, "Select Vendor", null))
        return list
    }

    private fun loadRecycler(context: Context){
        val rView: RecyclerView = findViewById(R.id.view_orderItems)
        rView.adapter = orderItemsAdapter
        rView.layoutManager = LinearLayoutManager(context)
        rView.setHasFixedSize(true)
    }

    private fun registerButtons() {
        findViewById<Button>(R.id.btn_saveOrder).setOnClickListener {
            saveOrder()
        }

        findViewById<FloatingActionButton>(R.id.btn_addItem).setOnClickListener {
            startAddItem()
        }

    }

    private fun startAddItem(){
        if(checkOrderNumber()) resultLauncher.launch(Intent(this, AddItem::class.java))
    }

    private fun addItem(itemJson: String){
        val newItemType = object : TypeToken<OrderItem?>() {}.type
        val newItem: OrderItem = Gson().fromJson(itemJson, newItemType)
        orderNumber = getOrderNumber()
        newItem.ordernumber = orderNumber
        orderItems += newItem
        orderItemsAdapter.notifyItemInserted(orderItems.size - 1)
    }

    private fun saveOrder(){
        if(checkAllFields(this)){
            runBlocking {
                val order = addOrder()
                saveItems(order)
            }
            finish()
        }
    }

    private fun addOrder(): String{
        val datePicker = findViewById<DatePicker>(R.id.datePicker)
        val spnVendor: Spinner = findViewById(R.id.spn_Vendor)
        var orderID: String? = null

        var vendor = spnVendor.selectedItem as Vendor
        var date = "${datePicker.year}-${datePicker.month + 1}-${datePicker.dayOfMonth}"
        var cost = getTotalCost()
        val job = CoroutineScope(Dispatchers.IO).launch {
            val api = APIClient(accesstoken, idtoken, baseUrl)
            orderID = api.addOrder(orderNumber!!, vendor.id, date, cost)
        }
        runBlocking {
            job.join()
        }
        return orderID!!
    }

    private fun saveItems(order: String){
        val gsonBuilder = GsonBuilder()
        val serializer: JsonSerializer<OrderItem> =
            JsonSerializer<OrderItem> { src, _, _ ->
                val jsonItem = JsonObject()
                jsonItem.addProperty("description", src.description)
                jsonItem.addProperty("cost", src.cost)
                jsonItem.addProperty("price", src.price)
                jsonItem.addProperty("model", src.model.id)
                jsonItem.addProperty("type", src.type.typeid)
                jsonItem.addProperty("checked_in", 0)
                jsonItem.addProperty("received", 0)
                jsonItem
            }
        gsonBuilder.registerTypeAdapter(OrderItem::class.java, serializer)
        var json = gsonBuilder.create().toJson(orderItems)
        val job = CoroutineScope(Dispatchers.IO).launch {
            val api = APIClient(accesstoken, idtoken, baseUrl)
            api.addOrderItems(order.toInt(), json)
        }
        runBlocking {
            job.join()
        }
    }

    private fun getOrderNumber(): String {
        val orderNumField = findViewById<EditText>(R.id.txt_OrderNumber)
        return orderNumField.text.toString()
    }

    private fun checkOrderNumber(): Boolean{
        val orderNumField = findViewById<EditText>(R.id.txt_OrderNumber)
        return if (TextUtils.isEmpty(orderNumField.text)) {
            orderNumField.error = "Enter Order Number first!"
            false
        } else true
    }

    private fun checkVendor(): Boolean{
        val spnVendor: Spinner = findViewById(R.id.spn_Vendor)
        val vendor = spnVendor.selectedItem as Vendor
        return if (vendor.id == 0){
            val view = spnVendor.selectedView as TextView
            view.error = "Please Select a Vendor"
            false
        } else true
    }

    private fun checkItems(ctx: Context): Boolean{
        return if (orderItems.size > 0) true
        else {
            val alert = AlertDialog.Builder(ctx)
                .setMessage("Please add an item before continuing")
                .setPositiveButton("OK") { _, _ ->
                    startAddItem()
                }
                .create()
            alert.setTitle("No Items Added")
            alert.show()
            false
        }
    }

    private fun checkAllFields(ctx: Context):Boolean{
        return checkOrderNumber() && checkVendor() && checkItems(ctx)
    }

    private fun getTotalCost(): Double {
        var totalCost = 0.00
        for(item in orderItems){
            totalCost += item.toDouble()
        }
        return totalCost
    }
}

