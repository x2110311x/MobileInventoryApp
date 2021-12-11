package com.asweeney.inventoryapp

import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AlertDialog
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.*

class ReceiveItem : AppCompatActivity() {
    private var labelPrinted = false
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_act_receive_item)

        setSpinner(true)
        CoroutineScope(Dispatchers.IO).launch { setSpinner() }
        registerButtons()

    }

    private fun receiveItem(ctx: Context){
        if(!labelPrinted){
            val alert = AlertDialog.Builder(ctx)
                .setMessage("Do you want to print a label before receiving?")
                .setCancelable(true)
                .setPositiveButton("Yes") { _, _ ->
                    printLabel()
                }
                .setNegativeButton("No") { dialog, _ ->
                    dialog.cancel()
                }
                .create()
            alert.setTitle("No Label Printed")
            alert.show()
        }
        Toast.makeText(applicationContext, "Receive Item", Toast.LENGTH_SHORT).show()
    }

    private fun printLabel(){
        Toast.makeText(applicationContext, "Print Label", Toast.LENGTH_SHORT).show()
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
                CoroutineScope(Dispatchers.IO).launch { loadItem(selectedObject) }
            }
        }

    }

    private fun registerButtons() {
        findViewById<Button>(R.id.btn_saveItemReceive).setOnClickListener {
            receiveItem(this)
        }
        findViewById<Button>(R.id.btn_printLabel).setOnClickListener {
            printLabel()
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
                val items = api.getReceivedItems()

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
                    "Serial Number: ${invItem.serial_number}\n" +
                    "ID: ${invItem.id}"
        }
    }

}