;安装时写入
!macro customInstall
    WriteRegStr HKCR "*\shell\treeZip" "" "通过treeZip压缩"
    WriteRegStr HKCR "*\shell\treeZip" "Icon" "$INSTDIR\treeZip.exe"
    WriteRegStr HKCR "*\shell\treeZip\command" "" '"$INSTDIR\treeZip.exe" "zip" "%1"'
    WriteRegStr HKCR "Directory\shell\treeZip" "" "通过treeZip压缩"
    WriteRegStr HKCR "Directory\shell\treeZip" "Icon" "$INSTDIR\treeZip.exe"
    WriteRegStr HKCR "Directory\shell\treeZip\command" "" '"$INSTDIR\treeZip.exe" "zip" "%V"'
    WriteRegStr HKCR "Directory\Background\shell\treeZip" "" "通过treeZip打开"
    WriteRegStr HKCR "Directory\Background\shell\treeZip" "Icon" "$INSTDIR\treeZip.exe"
    WriteRegStr HKCR "Directory\Background\shell\treeZip\command" "" '"$INSTDIR\treeZip.exe" "open" "%V"'
!macroend
;卸载时清除
!macro customUninstall
    DeleteRegKey HKCR "*\shell\treeZip"
    DeleteRegKey HKCR "Directory\shell\treeZip"
    DeleteRegKey HKCR "Directory\Background\shell\treeZip"

!macroend