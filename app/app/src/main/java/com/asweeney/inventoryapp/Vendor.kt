package com.asweeney.inventoryapp

data class Vendor (
    val id: Int,
    val name: String,
    @Suppress("kotlin:S117")
    val account_number: String?
){
    override fun toString(): String {
        return name
    }
}