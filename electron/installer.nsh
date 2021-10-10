;安装时写入
!macro customInstall
    WriteRegStr HKCR "*\shell\qingluan_demo" "" "通过demo打开"
    WriteRegStr HKCR "*\shell\qingluan_demo" "Icon" "$INSTDIR\青鸾.exe"
    WriteRegStr HKCR "*\shell\qingluan_demo\command" "" '"$INSTDIR\青鸾.exe" "zip" "%1"'
    WriteRegStr HKCR "Directory\Background\shell\qingluan_demo" "" "通过demo打开"
    WriteRegStr HKCR "Directory\Background\shell\qingluan_demo" "Icon" "$INSTDIR\青鸾.exe"
    WriteRegStr HKCR "Directory\Background\shell\qingluan_demo\command" "" '"$INSTDIR\青鸾.exe" "zip" "%V"'
    WriteRegStr HKCR "Directory\shell\qingluan_demo" "" "通过demo打开"
    WriteRegStr HKCR "Directory\shell\qingluan_demo" "Icon" "$INSTDIR\青鸾.exe"
    WriteRegStr HKCR "Directory\shell\qingluan_demo\command" "" '"$INSTDIR\青鸾.exe" "zip" "%V"'
!macroend
;卸载时清除
!macro customUninstall
    DeleteRegKey HKCR "*\shell\qingluan_demo"
    DeleteRegKey HKCR "Directory\Background\shell\qingluan_demo"
    DeleteRegKey HKCR "Directory\shell\qingluan_demo"

!macroend