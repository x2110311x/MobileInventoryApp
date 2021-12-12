package com.asweeney.inventoryapp

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView

class InventoryItemAdapter(private val inventoryItems: List<InventoryItem>, private val ctx: Context): RecyclerView.Adapter<InventoryItemAdapter.InventoryViewHolder>() {
    class InventoryViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        val name: TextView = itemView.findViewById(R.id.txt_item_name)
        val desc: TextView = itemView.findViewById(R.id.txt_item_details)
        val id: TextView = itemView.findViewById(R.id.txt_item_id)
        val serial: TextView = itemView.findViewById(R.id.txt_item_serial)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): InventoryViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.recycler_item_view,
        parent, false)

        return InventoryViewHolder(itemView)
    }


    override fun onBindViewHolder(holder: InventoryViewHolder, position: Int) {
        val currentItem =  inventoryItems[position]

        holder.name.text = currentItem.name
        holder.desc.text = "${currentItem.type} - ${currentItem.model}"
        holder.id.text = "#${currentItem.id}"
        holder.serial.text = "Serial Number: ${currentItem.serial_number}"
    }

    override fun getItemCount() = inventoryItems.size
}
