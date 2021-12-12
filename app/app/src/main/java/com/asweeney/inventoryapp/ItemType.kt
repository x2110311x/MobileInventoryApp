package com.asweeney.inventoryapp

data class ItemType(
    val typeid: Int,
    @Suppress("kotlin:S117")
    val type_name: String
) {
    override fun toString(): String {
        return type_name
    }
    fun toInt(): Int{
        return typeid
    }
}