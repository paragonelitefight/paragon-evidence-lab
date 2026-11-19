// Uncompiled source candidate using OpenFHE BinFHE. Synthetic bits only.
#include "binfhecontext.h"
#include <iostream>
int main() {
    using namespace lbcrypto;
    BinFHEContext cc;
    cc.GenerateBinFHEContext(STD128);
    auto secretKey = cc.KeyGen();
    cc.BTKeyGen(secretKey);
    auto encryptedA = cc.Encrypt(secretKey, 1);
    auto encryptedB = cc.Encrypt(secretKey, 0);
    auto encryptedResult = cc.EvalBinGate(AND, encryptedA, encryptedB);
    LWEPlaintext result;
    cc.Decrypt(secretKey, encryptedResult, &result);
    if (result != 0) { std::cerr << "FAIL: unexpected decrypted result\n"; return 1; }
    std::cout << "Synthetic encrypted AND result: " << result << "\n";
    return 0;
}
