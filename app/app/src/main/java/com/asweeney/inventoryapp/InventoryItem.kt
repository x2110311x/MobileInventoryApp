package com.asweeney.inventoryapp

import org.json.JSONObject

class InventoryItem(
    val id: Int,
    val order_number: String,
    private val description: String,
    var received: Number,
    var checked_out: Number,
    val cost: Double,
    val price: Double,
    val serial_number: String?,
    val model: String,
    val typeid: String
    ){
    val name: String
        get() = getNameFromDesc(description)
}

fun getNameFromDesc(desc: String): String {
    return JSONObject(desc).getString("name")
}