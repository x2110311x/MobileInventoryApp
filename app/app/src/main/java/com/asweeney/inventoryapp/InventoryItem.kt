package com.asweeney.inventoryapp

import org.json.JSONObject

class InventoryItem(
    val id: Int,
    @Suppress("kotlin:S117")
    val order_number: String,
    private val description: String,
    @Suppress("kotlin:S117")
    var received: Number,
    @Suppress("kotlin:S117")
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