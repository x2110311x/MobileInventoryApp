package com.asweeney.inventoryapp

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AlertDialog


class LoginCallback : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login_callback)
        val data: Uri? = intent?.data
        if (RootDetection.check(applicationContext)) {
            forceCloseApp(this)
        } else {
            val params =
                data!!.toString().split("?access=").toTypedArray()[1].split("&id=").toTypedArray()
            val accessToken = params[0]
            val idToken = params[1].replace("#", "")
            val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
            with(sharedPref.edit()) {
                putString("access_token", accessToken)
                putString("id_token", idToken)
                apply()
            }
            Toast.makeText(applicationContext, "Login Successful", Toast.LENGTH_SHORT).show()
            startActivity(
                Intent(this, MainPage::class.java)
                    .putExtra("Source", "from LoginCallback")
            )
            finish()
        }
    }
    private fun forceCloseApp(ctx: Context) {
        val alert = AlertDialog.Builder(ctx)
            .setMessage("This application cannot be run on rooted devices")
            .setCancelable(false)
            .setPositiveButton("Proceed") { _, _ ->
                finish()
            }
            .create()
        alert.setTitle("Root detected")
        alert.show()
    }

}