package com.asweeney.inventoryapp

import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.TextUtils
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AlertDialog
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.*
import androidx.print.PrintHelper

class ReceiveItem : AppCompatActivity() {
    private var labelPrinted = false
    private var invItem: InventoryItem? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_act_receive_item)

        setSpinner(true)
        CoroutineScope(Dispatchers.IO).launch { setSpinner() }
        registerButtons()

    }

    private fun receiveItem(ctx: Context){
        if(checkFields()) {
            if (!labelPrinted) {
                val alert = AlertDialog.Builder(ctx)
                    .setMessage("Do you want to print a label before receiving?")
                    .setCancelable(true)
                    .setPositiveButton("Yes") { _, _ ->
                        printLabel(ctx)
                    }
                    .setNegativeButton("No") { dialog, _ ->
                        dialog.cancel()
                    }
                    .create()
                alert.setTitle("No Label Printed")
                alert.show()
            } else {
                val job = CoroutineScope(Dispatchers.IO).launch {
                    val sharedPref =
                        getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                    val accesstoken = sharedPref.getString("access_token", "NONE")
                    val idtoken = sharedPref.getString("id_token", "NONE")
                    val baseUrl = resources.getString(R.string.api_baseurl)
                    val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
                    api.receiveItem(invItem!!.id)
                }
                runBlocking {
                    job.join()
                }
                finish()
            }
        }
    }

    private fun printLabel(ctx: Context){
        setSerial()
        val spnItems: Spinner = findViewById(R.id.spn_waitingItems)
        val selectedObject = spnItems.selectedItem as InventoryItem
        val job = CoroutineScope(Dispatchers.IO).launch {
            val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
            val accesstoken = sharedPref.getString("access_token", "NONE")
            val idtoken = sharedPref.getString("id_token", "NONE")
            val baseUrl = resources.getString(R.string.api_baseurl)
            val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
            val bitmap = api.getItemQRCode(selectedObject.id)
            PrintHelper(ctx).apply {
                scaleMode = PrintHelper.SCALE_MODE_FILL
            }.also { printHelper ->
                printHelper.printBitmap("QR Code", bitmap)
            }
        }
        runBlocking {
            job.join()
        }
        labelPrinted = true
    }

    private fun setSpinner(quick: Boolean = false){
        val context = this
        val spnItems: Spinner = findViewById(R.id.spn_waitingItems)
        val list = getItems(quick)

        CoroutineScope(Dispatchers.IO).launch(Dispatchers.Main) {
            val adapter: ArrayAdapter<InventoryItem> = object : ArrayAdapter<InventoryItem>(
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
                    if (position == spnItems.selectedItemPosition && position != 0) {
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
            spnItems.adapter = adapter
        }
        spnItems.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {

            override fun onNothingSelected(p0: AdapterView<*>?) {
                // You can define your actions as you want
            }

            override fun onItemSelected(p0: AdapterView<*>?, p1: View?, position: Int, p3: Long) {
                val selectedObject = spnItems.selectedItem as InventoryItem
                invItem = selectedObject
                CoroutineScope(Dispatchers.IO).launch { loadItem(invItem!!) }
            }
        }

    }

    private fun registerButtons() {
        findViewById<Button>(R.id.btn_saveItemReceive).setOnClickListener {
            receiveItem(this)
        }
        findViewById<Button>(R.id.btn_printLabel).setOnClickListener {
            printLabel(this)
        }
    }

    private fun getItems(quick: Boolean = false): List<InventoryItem> {
        var list = ArrayList<InventoryItem>()
        if (!quick) {
            val job = CoroutineScope(Dispatchers.IO).launch {
                val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                val accesstoken = sharedPref.getString("access_token", "NONE")
                val idtoken = sharedPref.getString("id_token", "NONE")
                val baseUrl = resources.getString(R.string.api_baseurl)
                val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
                val items = api.getNotReceivedItems()

                val listType = object : TypeToken<ArrayList<InventoryItem?>?>() {}.type
                list = Gson().fromJson(items, listType)
            }
            runBlocking {
                job.join()
            }
        }
        list.add(0, InventoryItem(0,"", "{'name':'Select Item'}",0,0,0.00,0.00,null, "", ""))
        return list
    }

    private fun loadItem(invItem: InventoryItem){
        if(invItem.id != 0 ) {
            val txtItemID: TextView = findViewById(R.id.txt_itemDetails)
            txtItemID.text = "Name: ${invItem.name}\n" +
                    "Type: ${invItem.typeid}\n" +
                    "Model: ${invItem.model}\n" +
                    "ID: ${invItem.id}"
        }
    }

    private fun checkSerialNumber(): Boolean{
        val serialNumField = findViewById<EditText>(R.id.txt_serialNum)
        return if (TextUtils.isEmpty(serialNumField.text)) {
            serialNumField.error = "Enter Serial Number first!"
            false
        } else true
    }

    private fun checkItem(): Boolean{
        val spnItem: Spinner = findViewById(R.id.spn_waitingItems)
        val item = spnItem.selectedItem as InventoryItem
        return if (item.id == 0){
            val view = spnItem.selectedView as TextView
            view.error = "Please select an item"
            false
        } else true
    }

    private fun checkFields(): Boolean {
        return checkItem() && checkSerialNumber()
    }

    private fun setSerial(){
        if(checkSerialNumber()) {
            val serialNumField = findViewById<EditText>(R.id.txt_serialNum)
            val serialNumber = serialNumField.text.toString()
            val job = CoroutineScope(Dispatchers.IO).launch {
                val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                val accesstoken = sharedPref.getString("access_token", "NONE")
                val idtoken = sharedPref.getString("id_token", "NONE")
                val baseUrl = resources.getString(R.string.api_baseurl)
                val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
                api.setItemSerial(invItem!!.id, serialNumber)
            }
            runBlocking {
                job.join()
            }
        }
    }
}