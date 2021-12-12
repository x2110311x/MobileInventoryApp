package com.asweeney.inventoryapp

import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import java.io.*

class RootDetection {
    companion object {
        fun check (ctx: Context): Boolean {
            if (isInDevMode()) {
                return false
            }
            return detectDevBuild() or
                    detectAPKs(ctx) or
                    detectSU() or
                    attemptSUCommand()
        }


        private fun detectDevBuild (): Boolean {
            val buildData: String = Build.TAGS
            return buildData.contains("test-keys")
        }
        
        
        private fun detectAPKs (ctx: Context): Boolean {
            val knownRootAPKs: Array<String> = arrayOf(
                "com.noshufou.android.su",
                "com.thirdparty.superuser",
                "eu.chainfire.supersu",
                "com.koushikdutta.superuser",
                "com.zachspong.temprootremovejb",
                "com.ramdroid.appquarantine"
            )
            val pm: PackageManager = ctx.packageManager

            for(uri in knownRootAPKs) {
                try {
                    pm.getPackageInfo(uri, PackageManager.GET_ACTIVITIES)
                    return true
                } catch (e: PackageManager.NameNotFoundException) {
                    // application is not installed
                }
            }

            return false
        }


        private fun detectSU (): Boolean {
            var suBinaries: Array<String> = arrayOf(
                "/system/bin/su",
                "/system/xbin/su",
                "/sbin/su",
                "/system/su",
                "/system/bin/.ext/.su",
                "/system/usr/we-need-root/su-backup",
                "/system/xbin/mu"
            )
            for (bin in suBinaries) {
                if (File(bin).exists()) {
                    return true
                }
            }
            return false
        }


        private fun attemptSUCommand (): Boolean {
            var idOutput: String = ""
            try {
                val proc = ProcessBuilder("su")
                    .redirectError(ProcessBuilder.Redirect.PIPE)
                    .start()

                val outputStream = BufferedOutputStream(proc.outputStream)
                val inputStream = BufferedInputStream(proc.inputStream)

                outputStream.write("id\n".toByteArray(Charsets.UTF_8))
                outputStream.flush()

                val idOutput = inputStream.bufferedReader().readLine()

                outputStream.write("exit\n".toByteArray(Charsets.UTF_8));
                outputStream.flush();

                outputStream.close()
                inputStream.close()
            } catch (e: Exception) {
                // silently do nothing
            }
            return idOutput.contains("(root)")
        }


        private fun isInDevMode (): Boolean {
            val buildTags: String = Build.TAGS
            return buildTags.contains("dev-keys")
        }
    }
}
