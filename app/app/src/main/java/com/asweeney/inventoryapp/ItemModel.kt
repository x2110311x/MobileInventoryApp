package com.asweeney.inventoryapp

data class ItemModel(
    val id: Int,
    val typeid: Int,
    val name: String
) {
    override fun toString(): String {
        return name
    }
}