package com.asweeney.inventoryapp

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import okhttp3.OkHttpClient
import java.io.IOException
import java.security.SecureRandom
import java.security.cert.X509Certificate
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager
import okhttp3.FormBody


class APIClient(private val accesstoken: String,
                private val idtoken: String,
                private val baseurl: String) {

    private fun getRequest(): okhttp3.Request.Builder{
        return okhttp3.Request.Builder()
            .addHeader("Authorization", "Bearer $idtoken")
            .addHeader("X-Auth", accesstoken)
    }

    private val client = OkHttpClient.Builder()
        .apply { if (BuildConfig.DEBUG) ignoreAllSSLErrors() }
        .build()
    private fun OkHttpClient.Builder.ignoreAllSSLErrors(): OkHttpClient.Builder {
        val naiveTrustManager = object : X509TrustManager {
            override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
            @Suppress("kotlin:S4830")
            override fun checkClientTrusted(certs: Array<X509Certificate>, authType: String) = Unit
            @Suppress("kotlin:S4830")
            override fun checkServerTrusted(certs: Array<X509Certificate>, authType: String) = Unit
        }

        val insecureSocketFactory = SSLContext.getInstance("TLSv1.2").apply {
            val trustAllCerts = arrayOf<TrustManager>(naiveTrustManager)
            init(null, trustAllCerts, SecureRandom())
        }.socketFactory

        sslSocketFactory(insecureSocketFactory, naiveTrustManager)
        hostnameVerifier { _, _ -> true }
        return this
    }
    fun checkLogin() : Boolean {
        val request = getRequest()
            .url(baseurl + "auth/loginstatus")
            .build()

        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string().toBoolean()
        }
    }

    fun getNotReceivedItems() : String {
        val request = getRequest()
            .url(baseurl + "api/items?received=false")
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getReceivedItems() : String {
        val request = getRequest()
            .url(baseurl + "api/items?received=true")
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getUsedItems() : String {
        val request = getRequest()
            .url(baseurl + "api/items?checkedout=true")
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getVendors() : String {
        val request = getRequest()
            .url(baseurl + "api/vendors")
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getItemTypes() : String {
        val request = getRequest()
            .url(baseurl + "api/types")
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getModels(typeid: Int) : String {
        val request = getRequest()
            .url(baseurl + "api/models?typeid=$typeid")
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getItem(itemID: Int) : String {
        val request = getRequest()
            .url(baseurl + "api/items/$itemID")
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getCompanies() : String {
        val request = getRequest()
            .url(baseurl + "api/companies")
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getCompanyUsers(companyID: Int) : String {
        val request = getRequest()
            .url(baseurl + "api/companies/$companyID/users")
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getItemQRCode(itemID: Int) : Bitmap {
        val request = getRequest()
            .url(baseurl + "api/items/$itemID/qrcode")
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return BitmapFactory.decodeStream(response.body!!.byteStream())
        }
    }

    fun setItemSerial(itemID: Int, serial: String) {
        val body = FormBody.Builder()
            .add("serial_number", serial)
            .build()
        val request = getRequest()
            .url(baseurl + "api/items/$itemID")
            .post(body)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
        }
    }

    fun receiveItem(itemID: Int) {
        val body = FormBody.Builder()
            .add("received", "true")
            .build()
        val request = getRequest()
            .url(baseurl + "api/items/$itemID")
            .post(body)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
        }
    }

    fun checkOutItem(itemID: Int, userID: Int, companyID: Int, ticket: Int){
        val body = FormBody.Builder()
            .add("checked_out", "true")
            .add("company", "$companyID")
            .add("user", "$userID")
            .add("ticket", "$ticket")
            .build()
        val request = getRequest()
            .url(baseurl + "api/items/$itemID")
            .post(body)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
        }
    }

    fun checkInItem(itemID: Int, reason: String){
        val body = FormBody.Builder()
            .add("checked_out", "false")
            .add("reason", reason)
            .build()
        val request = getRequest()
            .url(baseurl + "api/items/$itemID")
            .post(body)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
        }
    }

    fun addOrder(oNumber: String, vendor: Int, date: String, cost: Double): String{
        val body = FormBody.Builder()
            .add("orderNumber", oNumber)
            .add("vendor", vendor.toString())
            .add("date", date)
            .add("cost", cost.toString())
            .build()
        val request = getRequest()
            .url(baseurl + "api/orders")
            .put(body)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun addOrderItems(orderID: Int, items:String){
        val body = FormBody.Builder()
            .add("items", items)
            .build()
        val request = getRequest()
            .url(baseurl + "api/orders/$orderID/items")
            .put(body)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
        }
    }
}
