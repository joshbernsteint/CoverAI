@ECHO OFF
git add . >NUL 2>&1 && git commit -m %1 >NUL 2>&1 && git push >NUL 2>&1 && echo Changes pushed successfully