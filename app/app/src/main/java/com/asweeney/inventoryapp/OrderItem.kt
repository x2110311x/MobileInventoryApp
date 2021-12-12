package com.asweeney.inventoryapp

import com.google.gson.Gson
import org.json.JSONObject

class OrderItem(
    var ordernumber: String?,
    val description: String,
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
    override fun toString(): String {
        return ordernumber!!
    }
    fun toDouble(): Double {
        return cost
    }
}
