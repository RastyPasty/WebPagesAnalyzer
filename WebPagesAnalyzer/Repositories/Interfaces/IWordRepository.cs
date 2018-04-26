using Data;
using System.Collections.Generic;

namespace WebPagesAnalyzer.Repositories.Interfaces
{
    public interface IWordRepository
    {
        List<string> GetAllIds();
        Dictionary<string, int> GetAll();
        void PushData(List<Word> insertData, List<Word> updateData);
    }
}
