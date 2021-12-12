package com.asweeney.inventoryapp

class CompanyUser(
    val id: Int,
    @Suppress("kotlin:S117")
    val first_name: String,
    @Suppress("kotlin:S117")
    val last_name: String,
    val companyid: Int
    ){
    private val fullName: String
        get() = "$first_name $last_name"
    override fun toString(): String {
        return fullName
    }
}