package com.asweeney.inventoryapp

import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast


class LoginCallback : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login_callback)
        val data: Uri? = intent?.data
        val params = data!!.toString().split("?access=").toTypedArray()[1].split("&id=").toTypedArray()
        val accessToken = params[0]
        val idToken = params[1].replace("#","")
        val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
        with (sharedPref.edit()) {
            putString("access_token", accessToken)
            putString("id_token", idToken)
            apply()
        }
        Toast.makeText(applicationContext, "Login Successful", Toast.LENGTH_SHORT).show()
        startActivity(
            Intent(this, MainPage::class.java)
            .putExtra("Source", "from LoginCallback"))
        finish()
    }

}