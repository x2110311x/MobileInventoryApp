package com.asweeney.inventoryapp

class CompanyUser(
    val id: Int,
    val first_name: String,
    val last_name: String
    ){
    val fullName: String
        get() = "$first_name $last_name"
    override fun toString(): String {
        return fullName
    }
}