using HtmlAgilityPack;
using System;
using System.Net;
using System.Text.RegularExpressions;
using WebPagesAnalyzer.Services.Interfaces;

namespace WebPagesAnalyzer.Services
{
    public sealed class FetcherService : IFetcherService

    {
        /// <summary>
        /// Get web page text without html tags and scripts
        /// </summary>
        /// <param name="url">page url</param>
        /// <returns>page text</returns>
        public string Get(string url)
        {
            HtmlDocument htmlDoc = new HtmlDocument();                
            WebClient client = new WebClient();
            var html = client.DownloadString(url);
            htmlDoc.LoadHtml(Regex.Replace(html, @"<script[^>]*>[\s\S]*?</script>", String.Empty));
            var res = htmlDoc.DocumentNode.InnerText;            
            return Regex.Replace(res, @"\t|\n|\r|  ", String.Empty);

        }
    }
}
