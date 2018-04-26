using Microsoft.AspNetCore.Mvc;
using WebPagesAnalyzer.Services.Interfaces;
using WebPagesAnalyzer.Dto;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebPagesAnalyzer.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IPageHandlerService _pageHandlerService;

        public UserController(IPageHandlerService pageHandlerService)
        {
            _pageHandlerService = pageHandlerService;
        }

        [Route("")]
        [HttpPost]
        public IActionResult Page([FromBody]ProcessPageDto data)
        {
             var result = _pageHandlerService.Process(data.RequestUrl);
             return Ok(result);
        }

    }
}
