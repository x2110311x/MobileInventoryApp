package com.asweeney.inventoryapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.browser.customtabs.CustomTabsIntent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainPage : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        registerButtons()
        val source = intent.getStringExtra("Source")
        if (source != "from LoginCallback") checkLogin()
    }

    private fun checkLogin(){
        val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
        val accesstoken = sharedPref.getString("access_token", "NONE")
        val idtoken = sharedPref.getString("id_token", "NONE")
        val baseUrl = resources.getString(R.string.api_baseurl)
        Toast.makeText(applicationContext, "Checking Login Status", Toast.LENGTH_SHORT).show()
        CoroutineScope(Dispatchers.IO).launch {
            val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
            if (!(api.checkLogin())){
                openCustomTab()
            }
        }
    }
    private fun openCustomTab(){
        val builder = CustomTabsIntent.Builder()
        builder.setShowTitle(true)
        builder.setExitAnimations(this, android.R.anim.fade_in, android.R.anim.fade_out)
        val customTabsIntent = builder.build()
        customTabsIntent.intent.flags = Intent.FLAG_ACTIVITY_NO_HISTORY
        val baseUrl = resources.getString(R.string.api_baseurl)
        customTabsIntent.launchUrl(this, Uri.parse(baseUrl + "auth/applogin"))
        finish()
    }

    private fun registerButtons() {
        findViewById<Button>(R.id.btn_newOrder).setOnClickListener {
            startActivity(Intent(this, EnterNewOrder::class.java))
        }

        findViewById<Button>(R.id.btn_receiveItem).setOnClickListener {
            startActivity(Intent(this, ReceiveItem::class.java))
        }

        findViewById<Button>(R.id.btn_viewInventory).setOnClickListener {
            Toast.makeText(applicationContext, "Loading Items...", Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, ViewInventory::class.java))
        }

        findViewById<Button>(R.id.btn_checkOut).setOnClickListener {
            startActivity(Intent(this, CheckOutItem::class.java))
        }

        findViewById<Button>(R.id.btn_checkIn).setOnClickListener {
            startActivity(Intent(this, CheckInItem::class.java))
        }

        findViewById<Button>(R.id.btn_viewUsed).setOnClickListener {
            startActivity(Intent(this, ViewItemsUsed::class.java))
        }
    }
}