package com.asweeney.inventoryapp

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

class ViewItemsUsed : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_view_items_used)
        loadRecycler(this)
    }

    private fun loadRecycler(context: Context){
        val items = getItemData()
        val rView: RecyclerView = findViewById(R.id.view_usedItems)
        rView.adapter = UsedInventoryItemAdapter(items, context)
        rView.layoutManager = LinearLayoutManager(context)
        rView.setHasFixedSize(true)
    }
    private fun getItemData(): List<UsedInventoryItem> {
        var list = ArrayList<UsedInventoryItem>()
        val job = CoroutineScope(Dispatchers.IO).launch {
            val sharedPref = getSharedPreferences("com.asweeney.inventory.LOGIN", MODE_PRIVATE)
            val accesstoken = sharedPref.getString("access_token", "NONE")
            val idtoken = sharedPref.getString("id_token", "NONE")
            val baseUrl = resources.getString(R.string.api_baseurl)
            val api = APIClient(accesstoken!!, idtoken!!, baseUrl)
            val items = api.getUsedItems()

            val listType = object : TypeToken<ArrayList<UsedInventoryItem?>?>() {}.type
            list = Gson().fromJson(items, listType)
        }
        runBlocking {
            job.join()
        }
        return list
    }

}