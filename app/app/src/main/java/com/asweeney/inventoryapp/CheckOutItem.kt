package com.asweeney.inventoryapp

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.text.TextUtils
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.google.zxing.integration.android.IntentIntegrator
import kotlinx.coroutines.*
import org.json.JSONException
import org.json.JSONObject

class CheckOutItem : AppCompatActivity() {
    private lateinit var mQrResultLauncher : ActivityResultLauncher<Intent>
    private var invItem: InventoryItem? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_check_out_item)

        setCompanySpinner(true)
        CoroutineScope(Dispatchers.IO).launch { setCompanySpinner() }

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

        findViewById<Button>(R.id.btn_scanLabel).setOnClickListener {scanQR()}
        findViewById<Button>(R.id.btn_checkOutItem).setOnClickListener {checkOutItem(this)}
        findViewById<Button>(R.id.btn_checkOutItem).isEnabled = false
    }

    private fun setCompanySpinner(quick: Boolean = false) {
        val context = this
        val spnitemCompany: Spinner = findViewById(R.id.spn_itemCompany)
        val list = getCompanies(quick)
        CoroutineScope(Dispatchers.IO).launch(Dispatchers.Main) {
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
                CoroutineScope(Dispatchers.IO).launch { setUserSpinner(selectedObject.id) }
            }
        }
    }

    private fun setUserSpinner(company: Int = 0){
        val context = this
        val spnitemUser: Spinner = findViewById(R.id.spn_itemUser)
        val list = getUsers(company)

        CoroutineScope(Dispatchers.IO).launch(Dispatchers.Main) {
            spnitemUser.isEnabled = (company != 0)
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
                .setPositiveButton("Proceed") { _, _ ->
                    scanQR()
                }
                // negative button text and action
                .setNegativeButton("Cancel") { dialog, _ ->
                    dialog.cancel()
                }
                .create()
            alert.setTitle("Invalid QR Code Scanned")
            alert.show()
        }
        return itemID
    }

    private fun loadItem(itemID: Int){
        if(itemID != 0) {
            val txtItemID: TextView = findViewById(R.id.txt_itemID_out)
            CoroutineScope(Dispatchers.IO).launch {
                val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                val accesstoken = sharedPref.getString("access_token", "NONE")
                val idtoken = sharedPref.getString("id_token", "NONE")
                val baseUrl = resources.getString(R.string.api_baseurl)
                val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
                val item = api.getItem(itemID)
                invItem = Gson().fromJson(item, InventoryItem::class.java)
                CoroutineScope(Dispatchers.IO).launch(Dispatchers.Main) {
                    txtItemID.text = "Name: ${invItem!!.name}\n" +
                            "Type: ${invItem!!.type}\n" +
                            "Model: ${invItem!!.model}\n" +
                            "Serial Number: ${invItem!!.serial_number}\n" +
                            "ID: ${invItem!!.id}"
                    findViewById<Button>(R.id.btn_checkOutItem)?.isEnabled = true
                    Toast.makeText(applicationContext, "Item Loaded", Toast.LENGTH_SHORT).show()

                }
                delay(1000)
            }
        }
    }

    private fun getCompanies(quick: Boolean = false): List<Company> {
        var list = ArrayList<Company>()
        if(!quick) {
            val job = CoroutineScope(Dispatchers.IO).launch {
                val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                val accesstoken = sharedPref.getString("access_token", "NONE")
                val idtoken = sharedPref.getString("id_token", "NONE")
                val baseUrl = resources.getString(R.string.api_baseurl)
                val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
                val companies = api.getCompanies()

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
            val job = CoroutineScope(Dispatchers.IO).launch {
                val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                val accesstoken = sharedPref.getString("access_token", "NONE")
                val idtoken = sharedPref.getString("id_token", "NONE")
                val baseUrl = resources.getString(R.string.api_baseurl)
                val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
                val companies = api.getCompanyUsers(company)

                val listType = object : TypeToken<ArrayList<CompanyUser?>?>() {}.type
                list = Gson().fromJson(companies, listType)
            }
            runBlocking {
                job.join()
            }
        }
        list.add(0, CompanyUser(0, "Select", "User", 0))
        return list
    }

    private fun checkOutItem(ctx: Context){
        if(checkFields()) {
            if(invItem?.checked_out == 1){
                val alert = AlertDialog.Builder(ctx)
                    .setMessage("This item appears to already be checked out.\n" +
                            "Are you sure you want to check it out with this information?")
                    .setCancelable(true)
                    .setPositiveButton("Yes") { _, _ ->
                        submitData()
                    }
                    .setNegativeButton("No") { dialog, _ ->
                        dialog.cancel()
                    }
                    .create()
                alert.setTitle("Item Already Checked Out")
                alert.show()
            } else submitData();
        }
    }

    private fun submitData(){
        val spnUser: Spinner = findViewById(R.id.spn_itemUser)
        val user = spnUser.selectedItem as CompanyUser
        val ticketNum = findViewById<EditText>(R.id.txt_ticketNum).text.toString().toInt()
        val job = CoroutineScope(Dispatchers.IO).launch {
            val sharedPref =
                getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
            val accesstoken = sharedPref.getString("access_token", "NONE")
            val idtoken = sharedPref.getString("id_token", "NONE")
            val baseUrl = resources.getString(R.string.api_baseurl)
            val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
            api.checkOutItem(invItem!!.id, user.id, user.companyid, ticketNum)
        }
        runBlocking {
            job.join()
            finish()
        }
    }
    private fun checkUser(): Boolean{
        val spnUser: Spinner = findViewById(R.id.spn_itemUser)
        val spnCompany: Spinner = findViewById(R.id.spn_itemCompany)
        val user = spnUser.selectedItem as CompanyUser
        val company = spnCompany.selectedItem as Company
        return if (user.id == 0){
            val view = spnUser.selectedView as TextView
            view.error = "Please select a User"
            false
        } else return company.id == user.companyid
    }

    private fun checkTicket(): Boolean{
        val ticketNum = findViewById<EditText>(R.id.txt_ticketNum)
        return if (TextUtils.isEmpty(ticketNum.text)) {
            ticketNum.error = "Enter Ticket Number!"
            false
        } else true
    }

    private fun checkFields(): Boolean {
        return checkUser() && checkTicket()
    }
}