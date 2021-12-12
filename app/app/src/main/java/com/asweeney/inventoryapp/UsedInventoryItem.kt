package com.asweeney.inventoryapp

import org.json.JSONObject

class UsedInventoryItem(
    val id: Int,
    @Suppress("kotlin:S117")
    val order_number: String,
    private val description: String,
    @Suppress("kotlin:S117")
    val serial_number: String?,
    val model: String,
    val type: String,
    val company: String,
    val user: String,
    val ticket: Int
){
    val name: String
        get() = getNameFromDesc(description)

    private fun getNameFromDesc(desc: String): String {
        return JSONObject(desc).getString("name")
    }
}