namespace WebPagesAnalyzer.Services.Interfaces
{
    public interface ICryptoService
    {
        string Encrypt(string text, string key);
        string Decrypt(string text, string key);
        string GetSaltedHash(string text);
        bool VerifySaltedHash(string saltedHash, string text);
    }
}
