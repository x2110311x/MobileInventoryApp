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

    fun registerButtons(){
        val btn_newOrder = findViewById(R.id.btn_newOrder) as Button
        btn_newOrder.setOnClickListener {
            enterNewOrder()
        }

        val btn_receiveItem = findViewById(R.id.btn_receiveItem) as Button
        btn_receiveItem.setOnClickListener {
            receiveItem()
        }

        val btn_viewInventory = findViewById(R.id.btn_viewInventory) as Button
        btn_viewInventory.setOnClickListener {
            viewInventory()
        }

        val btn_checkOut = findViewById(R.id.btn_checkOut) as Button
        btn_checkOut.setOnClickListener {
            checkOut()
        }

        val btn_checkIn = findViewById(R.id.btn_checkIn) as Button
        btn_checkIn.setOnClickListener {
            checkIn()
        }

        val btn_viewUsed = findViewById(R.id.btn_viewUsed) as Button
        btn_viewUsed.setOnClickListener {
            viewUsedItems()
        }
    }

    fun enterNewOrder() {
        val intent = Intent(this, EnterNewOrder::class.java)
        startActivity(intent)
    }

    fun receiveItem() {
        val intent = Intent(this, ReceiveItem::class.java)
        startActivity(intent)
    }

    fun viewInventory(){
        val intent = Intent(this, ViewInventory::class.java)
        startActivity(intent)
    }

    fun checkOut(){
        val intent = Intent(this, CheckOutItem::class.java)
        startActivity(intent)
    }

    fun checkIn(){
        val intent = Intent(this, CheckInItem::class.java)
        startActivity(intent)
    }

    fun viewUsedItems(){
        val intent = Intent(this, ViewItemsUsed::class.java)
        startActivity(intent)
    }
}