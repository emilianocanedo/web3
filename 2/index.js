// Elemento HTML donde pondremos los balances
const textoBalance = document.getElementById('balance');

// Style para poder efectuar saltos de línea con \n
textoBalance.setAttribute('style', 'white-space: pre;');

// Agregar texto al final del párrafo
function agregarBalance(texto) {
  textoBalance.textContent += ' ' + texto;
}

// Función para conectarse a MetaMask y obtener los saldos de los tokens ERC20
async function obtenerSaldosERC20() {
    // borrar balances previos
    textoBalance.textContent = '';

    // Comprobar si MetaMask está instalado en el navegador
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable();
  
      // Crear una instancia del proveedor ethers.js utilizando MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
  
      // Obtener la dirección de la billetera conectada
      const accounts = await provider.listAccounts();
      const address = accounts[0];
  
      // Obtener el saldo de Ether de la billetera
      const etherBalance = await provider.getBalance(address);
      const formattedEtherBalance = ethers.utils.formatEther(etherBalance);
      agregarBalance(`Saldo de Ether: ${formattedEtherBalance}\n`);
 
      // Obtener el contrato del estándar ERC20
      const erc20Contract = new ethers.utils.Interface([
        'function balanceOf(address) view returns (uint256)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
      ]);

      // Aquí se agregan las direcciones de los contratos ERC20 que quieren ser inspeccionados
      const tokensERC20 = [
        '0x4da27a545c0c5b758a6ba100e3a049001de870f5' //stkAAVE como ejemplo
      ];
  
      // Obtener los saldos de los tokens ERC20
      console.log(tokensERC20);
      for (const tokenAddress of tokensERC20) {
        const tokenContract = new ethers.Contract(tokenAddress, erc20Contract, provider);
        const balance = await tokenContract.balanceOf(address);
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
  
        // Calcular el saldo ajustado considerando los decimales del token
        const adjustedBalance = balance / ethers.BigNumber.from(10).pow(decimals);
  
        agregarBalance(`Saldo ${symbol}: ${adjustedBalance}\n`);
      }
    } else {
      console.log('MetaMask no está instalado');
    }
  }
  
  // Manejador de evento para el botón de conexión a MetaMask
  document.getElementById('connectButton').addEventListener('click', obtenerSaldosERC20);