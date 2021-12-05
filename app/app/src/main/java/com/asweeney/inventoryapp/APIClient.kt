package com.asweeney.inventoryapp

import okhttp3.OkHttpClient
import java.io.IOException
import java.security.SecureRandom
import java.security.cert.X509Certificate
import javax.net.ssl.HostnameVerifier
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager


class APIClient(accesstoken: String, idtoken: String, baseurl: String) {
    var loginStatus = false
    private val accesstoken: String = accesstoken
    private val idtoken: String = idtoken
    private val base_url: String = baseurl
    private val client = OkHttpClient.Builder()
        .apply { if (BuildConfig.DEBUG) ignoreAllSSLErrors() }
        .build()
    private fun OkHttpClient.Builder.ignoreAllSSLErrors(): OkHttpClient.Builder {
        val naiveTrustManager = object : X509TrustManager {
            override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
            override fun checkClientTrusted(certs: Array<X509Certificate>, authType: String) = Unit
            override fun checkServerTrusted(certs: Array<X509Certificate>, authType: String) = Unit
        }

        val insecureSocketFactory = SSLContext.getInstance("TLSv1.2").apply {
            val trustAllCerts = arrayOf<TrustManager>(naiveTrustManager)
            init(null, trustAllCerts, SecureRandom())
        }.socketFactory

        sslSocketFactory(insecureSocketFactory, naiveTrustManager)
        hostnameVerifier(HostnameVerifier { _, _ -> true })
        return this
    }
    suspend fun checkLogin() {
        val request = okhttp3.Request.Builder()
            .url(base_url + "auth/loginstatus")
            .addHeader("X-Auth", accesstoken)
            .build()

        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")

            val resp = response.body!!.string()
            loginStatus = resp.toBoolean()
        }
    }
}
