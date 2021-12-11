package com.asweeney.inventoryapp

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class OrderItemAdapter(private val inventoryItems: List<OrderItem>): RecyclerView.Adapter<OrderItemAdapter.InventoryViewHolder>() {
    class InventoryViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        val name: TextView = itemView.findViewById(R.id.txt_item_name)
        val desc: TextView = itemView.findViewById(R.id.txt_item_details)
        val cost: TextView = itemView.findViewById(R.id.txt_item_cost)
        val price: TextView = itemView.findViewById(R.id.txt_item_price)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): InventoryViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.recycler_orderitem_view,
        parent, false)

        return InventoryViewHolder(itemView)
    }


    override fun onBindViewHolder(holder: InventoryViewHolder, position: Int) {
        val currentItem =  inventoryItems[position]

        holder.name.text = currentItem.name
        holder.desc.text = "${currentItem.type} - ${currentItem.model}"
        holder.cost.text = "Cost: ${currentItem.cost}"
        holder.price.text = "Price: ${currentItem.price}"
    }

    override fun getItemCount() = inventoryItems.size
}
