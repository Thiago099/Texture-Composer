using Microsoft.Web.WebView2.Core;
using System;
using System.Linq;

namespace TextureTool
{
    public partial class MainForm : Form
    {
        Panel whiteOverlay;
        public MainForm()
        {
            InitializeComponent();

            whiteOverlay = new Panel
            {
                Dock = DockStyle.Fill,
                BackColor = Color.FromArgb(76, 76, 76),
                Visible = true
            };

            Label textLabel = new Label
            {
                Text = "Loading...",
                ForeColor = Color.White,
                Font = new Font("Arial", 24, FontStyle.Bold),
                TextAlign = ContentAlignment.MiddleCenter,
                Dock = DockStyle.Fill
            };

            whiteOverlay.Controls.Add(textLabel);

            this.Controls.Add(whiteOverlay);
            whiteOverlay.BringToFront();
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

                //var hostObject = new HostObject();
                //webView.CoreWebView2.AddHostObjectToScript("host", hostObject);
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



        private void webView_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            whiteOverlay.Visible = false;
        }


        private void webView_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.F5)
            {
                whiteOverlay.Visible = true;
                whiteOverlay.BringToFront();
            }
        }
    }
}
