using Microsoft.Web.WebView2.Core;
using System;
using System.Linq;

namespace TextureTool
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            InitializeWebView();
        }
        private async void InitializeWebView()
        {
            var op = new CoreWebView2EnvironmentOptions("--disable-web-security");
            var env = await CoreWebView2Environment.CreateAsync(null, null, op);



            await webView.EnsureCoreWebView2Async(env);
            string publicFolderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "public");

            if (Directory.Exists(publicFolderPath))
            {

                var hostObject = new HostObject();
                webView.CoreWebView2.AddHostObjectToScript("host", hostObject);
                webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                    "appassets",
                    publicFolderPath,
                    CoreWebView2HostResourceAccessKind.Allow);


                webView.CoreWebView2.Navigate("https://appassets/index.html");
            }
            else
            {
                MessageBox.Show($"Folder not found: {publicFolderPath}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }


    }
}
