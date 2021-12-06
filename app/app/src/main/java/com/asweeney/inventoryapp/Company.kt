package com.asweeney.inventoryapp

data class Company (
    val id: Int,
    val name: String,
    val connectwiseID: String?
){
    override fun toString(): String {
        return name
    }
}