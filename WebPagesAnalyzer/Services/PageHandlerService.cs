using Data;
using System.Collections.Generic;
using WebPagesAnalyzer.Repositories.Interfaces;

namespace WebPagesAnalyzer.Services.Interfaces
{
    public class PageHandlerService : IPageHandlerService
    {
        private readonly ICryptoService _cryptoService;
        private readonly IFetcherService _fetcherService;
        private readonly IParserService _parserService;
        private readonly IWordRepository _wordRepository;

        public PageHandlerService(ICryptoService cryptoService,
            IFetcherService fetcherService,
            IParserService parserService,
            IWordRepository wordRepository)
        {
            _cryptoService = cryptoService;
            _fetcherService = fetcherService;
            _parserService = parserService;
            _wordRepository = wordRepository;
        }

        public bool Process(string url)
        {
            var pageContent = _fetcherService.Get(url);
            var top100 = _parserService.Parse(pageContent);

            var newWords = new List<Word>();
            var updateWords = new List<Word>();

            var existingWords = _wordRepository.GetAllIds();

            foreach (var obj in top100)
            {
                var needInsert = true;

                foreach (var id in existingWords)
                {
                    //possible some perfomance issues,
                    //adding CacheService can solve this
                    if (_cryptoService.VerifySaltedHash(id, obj.Key))
                    {
                        needInsert = false;
                        updateWords.Add(new Word
                        {
                            Id = id,
                            Count = obj.Value
                        });
                        break;
                    }
                }

                if (needInsert)
                {
                    newWords.Add(new Word
                    {
                        Id = _cryptoService.GetSaltedHash(obj.Key),
                        Data = _cryptoService.Encrypt(obj.Key, Consts.SecretKey),
                        Count = obj.Value
                    });
                }
            }

            _wordRepository.PushData(newWords, updateWords);

            return true;
        }
    }
}
