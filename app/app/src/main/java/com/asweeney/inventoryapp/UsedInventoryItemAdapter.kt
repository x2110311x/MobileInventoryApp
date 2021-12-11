package com.asweeney.inventoryapp

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView

class UsedInventoryItemAdapter(private val inventoryItems: List<UsedInventoryItem>, private val ctx: Context): RecyclerView.Adapter<UsedInventoryItemAdapter.UsedInventoryViewHolder>() {
    class UsedInventoryViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        val name: TextView = itemView.findViewById(R.id.txt_item_name)
        val desc: TextView = itemView.findViewById(R.id.txt_item_details)
        val id: TextView = itemView.findViewById(R.id.txt_item_id)
        val serial: TextView = itemView.findViewById(R.id.txt_item_serial)
        val companyUser: TextView = itemView.findViewById(R.id.txt_compuser)
        val ticket: TextView = itemView.findViewById(R.id.txt_ticket)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UsedInventoryViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.recycler_useditem_view,
        parent, false)

        return UsedInventoryViewHolder(itemView)
    }


    override fun onBindViewHolder(holder: UsedInventoryViewHolder, position: Int) {
        val currentItem =  inventoryItems[position]

        holder.name.text = currentItem.name
        holder.desc.text = "${currentItem.typeid} - ${currentItem.model}"
        holder.id.text = "#${currentItem.id}"
        holder.serial.text = "Serial Number: ${currentItem.serial_number}"
        holder.companyUser.text = ""
        holder.ticket.text = "Ticket #"
    }

    override fun getItemCount() = inventoryItems.size
}
