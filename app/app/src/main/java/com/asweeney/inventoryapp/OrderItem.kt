package com.asweeney.inventoryapp

import org.json.JSONObject

class OrderItem(
    val ordernumber: String?,
    private val description: String,
    val cost: Double,
    val price: Double,
    val model: ItemModel,
    val type: ItemType
){
    val name: String
        get() = getNameFromDesc(description)

    private fun getNameFromDesc(desc: String): String {
        return JSONObject(desc).getString("name")
    }
}
