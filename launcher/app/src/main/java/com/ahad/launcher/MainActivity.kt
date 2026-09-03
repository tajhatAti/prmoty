package com.ahad.launcher

import android.content.ComponentName
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.GridView
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var apps: List<ResolveInfo>
    private lateinit var pm: PackageManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        pm = packageManager
        val intent = Intent(Intent.ACTION_MAIN, null)
        intent.addCategory(Intent.CATEGORY_LAUNCHER)
        apps = pm.queryIntentActivities(intent, 0)
            .sortedBy { it.loadLabel(pm).toString().lowercase() }

        val grid = findViewById<GridView>(R.id.appGrid)
        grid.adapter = AppAdapter()
        grid.setOnItemClickListener { _, _, position, _ ->
            val info = apps[position].activityInfo
            val launchIntent = Intent(Intent.ACTION_MAIN).apply {
                addCategory(Intent.CATEGORY_LAUNCHER)
                component = ComponentName(info.packageName, info.name)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            startActivity(launchIntent)
        }
    }

    // This is a HOME app — there is no "previous screen" to go back to.
    override fun onBackPressed() {
        // intentionally empty: swallow the back button on the home screen
    }

    inner class AppAdapter : BaseAdapter() {
        override fun getCount() = apps.size
        override fun getItem(position: Int) = apps[position]
        override fun getItemId(position: Int) = position.toLong()

        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(this@MainActivity)
                .inflate(R.layout.app_icon_item, parent, false)
            val info = apps[position]
            view.findViewById<ImageView>(R.id.icon).setImageDrawable(info.loadIcon(pm))
            view.findViewById<TextView>(R.id.label).text = info.loadLabel(pm)
            return view
        }
    }
}
