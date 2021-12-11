package com.asweeney.inventoryapp

import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Spinner
import android.widget.TextView
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

class EnterNewOrder : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_act_enter_new_order)

        setSpinner(true)
        CoroutineScope(Dispatchers.IO).launch { setSpinner() }

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
        list.add(0, Vendor(0, "Select Company", null))
        return list
    }

}

