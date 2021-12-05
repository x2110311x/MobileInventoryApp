package com.asweeney.inventoryapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.content.Intent

class MainPage : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        registerButtons()
    }

    private fun registerButtons() {
        findViewById<Button>(R.id.btn_newOrder).setOnClickListener {
            startActivity(Intent(this, EnterNewOrder::class.java))
        }

        findViewById<Button>(R.id.btn_receiveItem).setOnClickListener {
            startActivity(Intent(this, ReceiveItem::class.java))
        }

        findViewById<Button>(R.id.btn_viewInventory).setOnClickListener {
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