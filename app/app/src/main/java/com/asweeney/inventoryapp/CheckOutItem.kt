package com.asweeney.inventoryapp

import android.annotation.SuppressLint
import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.google.zxing.integration.android.IntentIntegrator
import kotlinx.coroutines.*
import org.json.JSONException
import org.json.JSONObject

class CheckOutItem : AppCompatActivity() {
    private lateinit var mQrResultLauncher : ActivityResultLauncher<Intent>
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_check_out_item)

        setCompanySpinner(true)
        GlobalScope.launch(Dispatchers.Default) { setCompanySpinner() }

        mQrResultLauncher =
            registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {
                if (it.resultCode == RESULT_OK) {
                    val result = IntentIntegrator.parseActivityResult(it.resultCode, it.data)
                    var resultStr = ""
                    if (result.contents != null) {
                        // Do something with the contents (this is usually a URL)
                        resultStr+= result.contents
                        loadItem(getItemID(this, resultStr))
                    }
                }
            }

        findViewById<Button>(R.id.btn_scanLabel).setOnClickListener {
            scanQR()
        }
        findViewById<Button>(R.id.btn_checkOutItem)?.isEnabled = false
    }

    private fun setCompanySpinner(quick: Boolean = false) {
        val context = this
        val spnitemCompany: Spinner = findViewById(R.id.spn_itemCompany)
        val list = getCompanies(quick)
        GlobalScope.launch(Dispatchers.Main) {
            // initialize an array adapter for spinner
            val adapter: ArrayAdapter<Company> = object : ArrayAdapter<Company>(
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

                val selectedObject = spnitemCompany.selectedItem as Company
                GlobalScope.launch(Dispatchers.Default) { setUserSpinner(selectedObject.id) }
            }
        }
    }

    private fun setUserSpinner(company: Int = 0){
        val context = this
        val spnitemUser: Spinner = findViewById(R.id.spn_itemUser)
        val list = getUsers(company)

        GlobalScope.launch(Dispatchers.Main) {
            // initialize an array adapter for spinner
            val adapter: ArrayAdapter<CompanyUser> = object : ArrayAdapter<CompanyUser>(
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

    private fun scanQR(){
        val scanner = IntentIntegrator(this)
        // QR Code Format
        scanner.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE)
        // Set Text Prompt at Bottom of QR code Scanner Activity
        scanner.setPrompt("QR Code Scanner Prompt Text")
        // Start Scanner (don't use initiateScan() unless if you want to use OnActivityResult)
        mQrResultLauncher.launch(scanner.createScanIntent())
    }

    private fun getItemID(ctx: Context, data: String): Int {
        var itemID = 0
        try {
            itemID = JSONObject(data).getInt("id")
        } catch(e: JSONException) {
            val alert = AlertDialog.Builder(ctx)
                .setMessage("Scan another QR Code?")
                .setCancelable(true)
                .setPositiveButton("Proceed", DialogInterface.OnClickListener {
                        dialog, id -> scanQR()
                })
                // negative button text and action
                .setNegativeButton("Cancel", DialogInterface.OnClickListener {
                        dialog, id -> dialog.cancel()
                })
                .create()
            alert.setTitle("Invalid QR Code Scanned")
            alert.show()
        }
        return itemID
    }

    @SuppressLint("SetTextI18n")
    private fun loadItem(itemID: Int){
        lateinit var invItem: InventoryItem
        val txtItemID: TextView = findViewById(R.id.txt_itemID_out)
        GlobalScope.launch(Dispatchers.Default) {
            val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
            val accesstoken = sharedPref.getString("access_token", "NONE")
            val idtoken = sharedPref.getString("id_token", "NONE")
            val baseUrl = resources.getString(R.string.api_baseurl)
            val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
            val item = api.getItem(itemID)
            invItem = Gson().fromJson(item, InventoryItem::class.java)
            GlobalScope.launch(Dispatchers.Main) {
                txtItemID.text = "Name: ${invItem.name}\n" +
                        "Type: ${invItem.typeid}\n" +
                        "Model: ${invItem.model}\n" +
                        "Serial Number: ${invItem.serial_number}\n" +
                        "ID: ${invItem.id}"
                findViewById<Button>(R.id.btn_checkOutItem)?.isEnabled = true
                Toast.makeText(applicationContext, "Item Loaded", Toast.LENGTH_SHORT).show()

            }
            delay(1000)
        }
    }

    private fun getCompanies(quick: Boolean = false): List<Company> {
        var list = ArrayList<Company>()
        if(!quick) {
            val job = GlobalScope.launch(Dispatchers.Default) {
                val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                val accesstoken = sharedPref.getString("access_token", "NONE")
                val idtoken = sharedPref.getString("id_token", "NONE")
                val baseUrl = resources.getString(R.string.api_baseurl)
                val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
                var companies = api.getCompanies()

                val listType = object : TypeToken<ArrayList<Company?>?>() {}.type
                list = Gson().fromJson(companies, listType)
            }
            runBlocking {
                job.join()
            }
        }
        list.add(0, Company(0, "Select Company", null))
        return list
    }

    private fun getUsers(company: Int): List<CompanyUser> {
        var list = ArrayList<CompanyUser>()
        if(company != 0){
            val job = GlobalScope.launch(Dispatchers.Default) {
                val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                val accesstoken = sharedPref.getString("access_token", "NONE")
                val idtoken = sharedPref.getString("id_token", "NONE")
                val baseUrl = resources.getString(R.string.api_baseurl)
                val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
                var companies = api.getCompanyUsers(company)

                val listType = object : TypeToken<ArrayList<CompanyUser?>?>() {}.type
                list = Gson().fromJson(companies, listType)
            }
            runBlocking {
                job.join()
            }
        }
        list.add(0, CompanyUser(0, "Select", "User"))
        return list
    }

}