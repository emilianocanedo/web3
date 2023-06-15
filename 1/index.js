// Función asincrónica para conectar con MetaMask y obtener el saldo
async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Solicitar acceso a la cuenta de MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        const address = accounts[0];
        const balance = await provider.getBalance(address);

        // Convertir el saldo a Ether
        const etherBalance = ethers.utils.formatEther(balance);

        // Actualizar el elemento HTML con el saldo
        document.getElementById('balance').textContent = `Saldo en Ether: ${etherBalance}`;
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('MetaMask no está instalado');
    }
  }

  // Evento click en el botón para conectar con MetaMask
  document.getElementById('connectButton').addEventListener('click', getBalance);
