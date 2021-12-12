package com.asweeney.inventoryapp

import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.*
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import android.content.Intent
import android.text.TextUtils


class AddItem : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_item)

        setTypeSpinner(true)
        CoroutineScope(Dispatchers.IO).launch { setTypeSpinner() }


        findViewById<Button>(R.id.btn_add_new_item).setOnClickListener {
            saveItem()
        }
    }

    private fun setTypeSpinner(quick: Boolean = false) {
        val context = this
        val spnitemCompany: Spinner = findViewById(R.id.spn_itemtype)
        val list = getTypes(quick)
        CoroutineScope(Dispatchers.IO).launch(Dispatchers.Main) {
            // initialize an array adapter for spinner
            val adapter: ArrayAdapter<ItemType> = object : ArrayAdapter<ItemType>(
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
                    if (position == spnitemCompany.selectedItemPosition && position != 0) {
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
            spnitemCompany.adapter = adapter
        }
        spnitemCompany.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {

            override fun onNothingSelected(p0: AdapterView<*>?) {
                // You can define your actions as you want
            }

            override fun onItemSelected(p0: AdapterView<*>?, p1: View?, position: Int, p3: Long) {

                val selectedObject = spnitemCompany.selectedItem as ItemType
                CoroutineScope(Dispatchers.IO).launch { setModelSpinner(selectedObject.typeid) }
            }
        }
    }

    private fun setModelSpinner(type: Int = 0){
        val context = this
        val spnitemUser: Spinner = findViewById(R.id.spn_itemModel)
        val list = getModels(type)

        CoroutineScope(Dispatchers.IO).launch(Dispatchers.Main) {
            spnitemUser.isEnabled = (type != 0)

            val adapter: ArrayAdapter<ItemModel> = object : ArrayAdapter<ItemModel>(
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
                    if (position == spnitemUser.selectedItemPosition && position != 0) {
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
            spnitemUser.adapter = adapter
        }
    }

    private fun getTypes(quick: Boolean = false): List<ItemType> {
        var list = ArrayList<ItemType>()
        if(!quick) {
            val job = CoroutineScope(Dispatchers.IO).launch {
                val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                val accesstoken = sharedPref.getString("access_token", "NONE")
                val idtoken = sharedPref.getString("id_token", "NONE")
                val baseUrl = resources.getString(R.string.api_baseurl)
                val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
                val types = api.getItemTypes()

                val listType = object : TypeToken<ArrayList<ItemType?>?>() {}.type
                list = Gson().fromJson(types, listType)
            }
            runBlocking {
                job.join()
            }
        }
        list.add(0, ItemType(0, "Select Type"))
        return list
    }

    private fun getModels(type: Int): List<ItemModel> {
        var list = ArrayList<ItemModel>()
        if(type != 0){
            val job = CoroutineScope(Dispatchers.IO).launch {
                val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                val accesstoken = sharedPref.getString("access_token", "NONE")
                val idtoken = sharedPref.getString("id_token", "NONE")
                val baseUrl = resources.getString(R.string.api_baseurl)
                val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
                val models = api.getModels(type)

                val listType = object : TypeToken<ArrayList<ItemModel?>?>() {}.type
                list = Gson().fromJson(models, listType)
            }
            runBlocking {
                job.join()
            }
        }
        list.add(0, ItemModel(0, type, "Select Model"))
        return list
    }

    private fun saveItem(){
        if(checkFields()) {
            val itemModel = findViewById<Spinner>(R.id.spn_itemModel).selectedItem as ItemModel
            val itemType = findViewById<Spinner>(R.id.spn_itemtype).selectedItem as ItemType
            val itemName: String = findViewById<EditText>(R.id.txt_itemName).text.toString()
            val itemCost: Double =
                findViewById<EditText>(R.id.txt_itemCost).text.toString().toDouble()
            val itemPrice: Double =
                findViewById<EditText>(R.id.txt_itemPrice).text.toString().toDouble()

            val newItem =
                OrderItem(null, "{'name':'$itemName'}", itemCost, itemPrice, itemModel, itemType)
            val newItemJson = Gson().toJson(newItem)
            val output = Intent()
            output.putExtra("newItem", newItemJson)
            setResult(RESULT_OK, output)
            finish()
        }
    }

    private fun checkName(): Boolean {
        val itemName = findViewById<EditText>(R.id.txt_itemName)
        return if (TextUtils.isEmpty(itemName.text)) {
            itemName.error = "Enter Item Name!"
            false
        } else true
    }

    private fun checkCost(): Boolean {
        val itemCost = findViewById<EditText>(R.id.txt_itemCost)
        return if (TextUtils.isEmpty(itemCost.text)) {
            itemCost.error = "Enter Item Cost!"
            false
        } else true
    }

    private fun checkPrice(): Boolean {
        val itemPrice = findViewById<EditText>(R.id.txt_itemPrice)
        val itemCost = findViewById<EditText>(R.id.txt_itemCost)
        return when {
            (TextUtils.isEmpty(itemPrice.text)) -> {
                itemPrice.error = "Enter Item Price!"
                false
            }
            (itemPrice.text.toString().toDouble() < itemCost.text.toString().toDouble()) -> {
                itemPrice.error = "Price should be higher than cost!"
                false
            }
            else -> true
        }
    }

    private fun checkModel(): Boolean{
        val spnModel: Spinner = findViewById(R.id.spn_itemModel)
        val spnType: Spinner = findViewById(R.id.spn_itemtype)
        val model = spnModel.selectedItem as ItemModel
        val type = spnType.selectedItem as ItemType
        return if (model.id == 0){
            val view = spnModel.selectedView as TextView
            view.error = "Please Select a Model"
            false
        } else return type.typeid == model.typeid
    }

    private fun checkFields(): Boolean {
        return checkName() && checkCost() && checkPrice() && checkModel()
    }
}