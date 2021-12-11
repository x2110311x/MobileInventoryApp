package com.asweeney.inventoryapp

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts.StartActivityForResult
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

class EnterNewOrder : AppCompatActivity() {
    private val orderItems = ArrayList<OrderItem>()
    private val orderItemsAdapter = OrderItemAdapter(orderItems)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_act_enter_new_order)

        setSpinner(true)
        CoroutineScope(Dispatchers.IO).launch { setSpinner() }
        loadRecycler(this)
        registerButtons()
    }

    private fun setSpinner(quick: Boolean = false){
        val context = this
        val spnVendor: Spinner = findViewById(R.id.spn_Vendor)
        val list = getVendors()

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
                    // set item text bold
                    view.setTypeface(view.typeface, Typeface.BOLD)

                    // set selected item style
                    if (position == spnVendor.selectedItemPosition && position != 0) {
                        view.background = ColorDrawable(Color.parseColor("#F7E7CE"))
                        view.setTextColor(Color.parseColor("#333399"))
                    }

                    // make hint item color gray
                    if (position == 0) {
                        view.setTextColor(Color.LTGRAY)
                    }

                    return view
                }

                override fun isEnabled(position: Int): Boolean {
                    // disable first item
                    // first item is display as hint
                    return position != 0
                }
            }

            // finally, data bind spinner with adapter
            spnVendor.adapter = adapter
        }
    }

    private fun getVendors(quick: Boolean = false): List<Vendor> {
        var list = ArrayList<Vendor>()
        if(!quick) {
            val job = CoroutineScope(Dispatchers.IO).launch {
                val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                val accesstoken = sharedPref.getString("access_token", "NONE")
                val idtoken = sharedPref.getString("id_token", "NONE")
                val baseUrl = resources.getString(R.string.api_baseurl)
                val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
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
        resultLauncher.launch(Intent(this, AddItem::class.java))
    }

    private fun addItem(itemJson: String){
        val newItemType = object : TypeToken<OrderItem?>() {}.type
        val newItem: OrderItem = Gson().fromJson(itemJson, newItemType)
        orderItems += newItem
        orderItemsAdapter.notifyItemInserted(orderItems.size - 1);
    }

    private fun saveOrder(){
        Toast.makeText(applicationContext, "Save Order", Toast.LENGTH_SHORT).show()
    }

    var resultLauncher = registerForActivityResult(StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val data = result.data?.getStringExtra("newItem")
            addItem(data!!)
        }
    }
}

