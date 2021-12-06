package com.asweeney.inventoryapp

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.Gson
import com.google.zxing.integration.android.IntentIntegrator
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.json.JSONException
import org.json.JSONObject

class CheckInItem : AppCompatActivity() {
    private lateinit var mQrResultLauncher : ActivityResultLauncher<Intent>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_check_in_item)
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

        findViewById<Button>(R.id.btn_scanLabel_checkIn).setOnClickListener {
            scanQR()
        }
        findViewById<Button>(R.id.btn_checkInItem)?.isEnabled = false

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

    @SuppressLint("SetTextI18n")
    private fun loadItem(itemID: Int) {
        if (itemID != 0) {
            lateinit var invItem: InventoryItem
            val txtItemID: TextView = findViewById(R.id.txt_itemID_in)
            CoroutineScope(Dispatchers.IO).launch {
                val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
                val accesstoken = sharedPref.getString("access_token", "NONE")
                val idtoken = sharedPref.getString("id_token", "NONE")
                val baseUrl = resources.getString(R.string.api_baseurl)
                val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
                val item = api.getItem(itemID)
                invItem = Gson().fromJson(item, InventoryItem::class.java)
                CoroutineScope(Dispatchers.IO).launch(Dispatchers.Main) {
                    txtItemID.text = "Name: ${invItem.name}\n" +
                            "Type: ${invItem.typeid}\n" +
                            "Model: ${invItem.model}\n" +
                            "Serial Number: ${invItem.serial_number}\n" +
                            "ID: ${invItem.id}"
                    findViewById<Button>(R.id.btn_checkInItem)?.isEnabled = true
                    Toast.makeText(applicationContext, "Item Loaded", Toast.LENGTH_SHORT).show()

                }
                delay(1000)
            }
        }
    }

}