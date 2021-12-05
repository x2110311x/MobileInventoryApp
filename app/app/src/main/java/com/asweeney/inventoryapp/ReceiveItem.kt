package com.asweeney.inventoryapp

import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.*

class ReceiveItem : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_act_receive_item)
        setSpinner()
        registerButtons()
    }

    fun receiveItem(){
        Toast.makeText(applicationContext, "Receive Item", Toast.LENGTH_SHORT).show()
    }

    fun printLabel(){
        Toast.makeText(applicationContext, "Print Label", Toast.LENGTH_SHORT).show()
    }

    fun setSpinner(){
        val context = this
        val spnwaitingItems: Spinner = findViewById(R.id.spn_waitingItems)
        val list = mutableListOf(
            "Item 1",
            "Item 2",
            "Item 3",
            "Item 4",
        )

        list.add(0, "Select Item")

        // initialize an array adapter for spinner
        val adapter: ArrayAdapter<String> = object : ArrayAdapter<String>(
            context,
            android.R.layout.simple_spinner_dropdown_item,
            list
        ) {
            override fun getDropDownView(
                position: Int,
                convertView: View?,
                parent: ViewGroup
            ): View {
                val view: TextView = super.getDropDownView(
                    position,
                    convertView,
                    parent
                ) as TextView
                // set item text bold
                view.setTypeface(view.typeface, Typeface.BOLD)

                // set selected item style
                if (position == spnwaitingItems.selectedItemPosition && position != 0) {
                    view.background = ColorDrawable(Color.parseColor("#F7E7CE"))
                    view.setTextColor(Color.parseColor("#333399"))
                }

                // make hint item color gray
                if (position == 0) {
                    view.setTextColor(Color.LTGRAY)
                }

                return view
            }

            override fun isEnabled(position: Int): Boolean {
                // disable first item
                // first item is display as hint
                return position != 0
            }
        }

        // finally, data bind spinner with adapter
        spnwaitingItems.adapter = adapter
    }

    private fun registerButtons() {
        findViewById<Button>(R.id.btn_saveItemReceive).setOnClickListener {
            receiveItem()
        }
        findViewById<Button>(R.id.btn_printLabel).setOnClickListener {
            printLabel()
        }
    }
}