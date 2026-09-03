package com.ahad.launcher

import android.content.ComponentName
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.graphics.drawable.Drawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.GridView
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var apps: List<ResolveInfo>
    private lateinit var pm: PackageManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        pm = packageManager
        loadApps()
    }

    override fun onResume() {
        super.onResume()
        // Refresh app list every time launcher comes to foreground
        loadApps()
    }

    private fun loadApps() {
        val intent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }
        apps = pm.queryIntentActivities(intent, PackageManager.GET_META_DATA)
            .sortedBy { it.loadLabel(pm).toString().lowercase() }

        val grid = findViewById<GridView>(R.id.appGrid)
        grid.adapter = AppAdapter()
        grid.setOnItemClickListener { _, _, position, _ ->
            launchApp(apps[position])
        }
    }

    private fun launchApp(info: ResolveInfo) {
        try {
            val activityInfo = info.activityInfo
            val launchIntent = Intent(Intent.ACTION_MAIN).apply {
                addCategory(Intent.CATEGORY_LAUNCHER)
                component = ComponentName(activityInfo.packageName, activityInfo.name)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
            }
            startActivity(launchIntent)
        } catch (e: Exception) {
            Toast.makeText(this, "Cannot open app", Toast.LENGTH_SHORT).show()
        }
    }

    @Suppress("OVERRIDE_DEPRECATION")
    override fun onBackPressed() {
        // Home screen — swallow back press
    }

    inner class AppAdapter : BaseAdapter() {

        data class AppItem(val label: String, val icon: Drawable, val info: ResolveInfo)

        private val items: List<AppItem> = apps.map {
            AppItem(
                label = it.loadLabel(pm).toString(),
                icon  = it.loadIcon(pm),
                info  = it
            )
        }

        override fun getCount() = items.size
        override fun getItem(position: Int) = items[position]
        override fun getItemId(position: Int) = position.toLong()

        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            val view = convertView ?: LayoutInflater.from(this@MainActivity)
                .inflate(R.layout.app_icon_item, parent, false)

            val item = items[position]
            view.findViewById<ImageView>(R.id.icon).setImageDrawable(item.icon)
            view.findViewById<TextView>(R.id.label).text = item.label
            return view
        }
    }
}
