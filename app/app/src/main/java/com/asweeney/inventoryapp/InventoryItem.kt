package com.asweeney.inventoryapp

import org.json.JSONObject

class InventoryItem(
    val id: Int,
    @Suppress("kotlin:S117")
    val order_number: String,
    private val description: String,
    var received: Int,
    @Suppress("kotlin:S117")
    var checked_out: Int,
    val cost: Double,
    val price: Double,
    @Suppress("kotlin:S117")
    val serial_number: String?,
    val model: String,
    val typeid: String
){
    val name: String
        get() = getNameFromDesc(description)

    private fun getNameFromDesc(desc: String): String {
        return JSONObject(desc).getString("name")
    }

    override fun toString(): String {
        return name
    }
}