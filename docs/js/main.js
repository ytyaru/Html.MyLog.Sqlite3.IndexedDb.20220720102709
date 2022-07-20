window.addEventListener('DOMContentLoaded', async(event) => {
    console.log('DOMContentLoaded!!');
    const db = new MyLogDb()
    const sqlFile = new Sqlite3DbFile()
    const downloader = new MyLogDownloader(db)
    const uploader = new MyLogUploader(db, sqlFile)
    document.getElementById('post').addEventListener('click', async(event) => {
        const content = document.getElementById('content').value
        if (!content) { alert('つぶやく内容をテキストエリアに入力してください。'); return }
        const now = Math.floor(new Date().getTime() / 1000)
        document.getElementById('post-list').innerHTML = db.insert(content, now) + document.getElementById('post-list').innerHTML
        document.getElementById('content').value = ''
        document.getElementById('content').focus()
        //if (document.getElementById('is-over-write').checked) {
            const path = document.getElementById('file-input').value
            const name = path.replace(/.*[\/\\]/, '');
            //sqlFile.read(name)
            //const res = sqlFile.db.exec(`select * from comments where created = (select MAX(created) from comments);`)
            sqlFile.db.exec(`insert into comments(content, created) values('${content}', ${now});`)
            await sqlFile.write(name)
            //console.debug(sqlFile.file)
            //sqlFile.write(sqlFile.file.name)
            Toaster.toast(`ローカルファイルを上書きしました。: ${name}`)
        //}
    })
    document.getElementById('download').addEventListener('click', async(event) => {
        await downloader.download()
    })
    document.getElementById('delete').addEventListener('click', async(event) => {
        if (confirm('つぶやきをすべて削除します。\n本当によろしいですか？')) {
            await db.clear()
            document.getElementById('post-list').innerHTML = await db.toHtml()
            document.getElementById('content').focus()
        }
    })
    Loading.setup()
    uploader.setup()
    document.getElementById('post-list').innerHTML = await db.toHtml()
    document.getElementById('content').focus()
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

