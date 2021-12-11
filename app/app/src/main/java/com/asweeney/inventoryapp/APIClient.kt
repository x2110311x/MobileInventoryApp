package com.asweeney.inventoryapp

import okhttp3.OkHttpClient
import okhttp3.Response
import java.io.IOException
import java.security.SecureRandom
import java.security.cert.X509Certificate
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager


class APIClient(private val accesstoken: String,
                private val idtoken: String,
                private val baseurl: String) {
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
        val request = okhttp3.Request.Builder()
            .url(baseurl + "auth/loginstatus")
            .header("Authorization", "Bearer $idtoken")
            .addHeader("X-Auth", accesstoken)
            .build()

        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string().toBoolean()
        }
    }

    fun getReceivedItems() : String {
        val request = okhttp3.Request.Builder()
            .url(baseurl + "api/items?received=true")
            .header("Authorization", "Bearer $idtoken")
            .header("X-Auth", accesstoken)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getUsedItems() : String {
        val request = okhttp3.Request.Builder()
            .url(baseurl + "api/items?checkedout=true")
            .header("Authorization", "Bearer $idtoken")
            .header("X-Auth", accesstoken)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getVendors() : String {
        val request = okhttp3.Request.Builder()
            .url(baseurl + "api/vendors")
            .header("Authorization", "Bearer $idtoken")
            .header("X-Auth", accesstoken)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getItemTypes() : String {
        val request = okhttp3.Request.Builder()
            .url(baseurl + "api/types")
            .header("Authorization", "Bearer $idtoken")
            .header("X-Auth", accesstoken)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getModels(typeid: Int) : String {
        val request = okhttp3.Request.Builder()
            .url(baseurl + "api/models?typeid=$typeid")
            .header("Authorization", "Bearer $idtoken")
            .header("X-Auth", accesstoken)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getItem(itemID: Int) : String {
        val request = okhttp3.Request.Builder()
            .url(baseurl + "api/items/$itemID")
            .header("Authorization", "Bearer $idtoken")
            .header("X-Auth", accesstoken)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getCompanies() : String {
        val request = okhttp3.Request.Builder()
            .url(baseurl + "api/companies")
            .header("Authorization", "Bearer $idtoken")
            .header("X-Auth", accesstoken)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }

    fun getCompanyUsers(companyID: Int) : String {
        val request = okhttp3.Request.Builder()
            .url(baseurl + "api/companies/$companyID/users")
            .header("Authorization", "Bearer $idtoken")
            .header("X-Auth", accesstoken)
            .build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            return response.body!!.string()
        }
    }
}
