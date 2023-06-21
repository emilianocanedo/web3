const abi = [
    // Funciones estándar de ERC721
    'function balanceOf(address owner) view returns (uint256)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function tokenURI(uint256 tokenId) view returns (string)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  
    // Agrega aquí otras funciones específicas de tu contrato ERC721 si las tienes
  ];

// Función para conectarse a MetaMask y obtener los NFTs
async function obtenerNFTs() {
    // Comprobar si MetaMask está instalado en el navegador
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.enable();
  
      // Crear una instancia del proveedor ethers.js utilizando MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
  
      // Obtener la dirección de la billetera conectada
      const accounts = await provider.listAccounts();
      const address = accounts[0];
  
      // Obtener los NFTs del balance del contrato ERC721 (ejemplo con el contrato de ArtBlocks)
      const erc721Contract = new ethers.Contract(ethers.utils.getAddress("0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270"), abi, provider);
  
      const balance = await erc721Contract.balanceOf(address);
  
      const nftListElement = document.getElementById('nftList');
  
      for (let i = 0; i < balance; i++) {
        const tokenId = await erc721Contract.tokenOfOwnerByIndex(address, i);
        const tokenURI = await erc721Contract.tokenURI(tokenId);
        
        // Realizar una solicitud HTTP para obtener el contenido JSON
        const response = await fetch(tokenURI);
        const json = await response.json();
  
        const nftElement = document.createElement('div');
        const imageElement = document.createElement('img');
  
        // Mostrar la imagen del NFT
        imageElement.src = json["preview_asset_url"];
        imageElement.style.width = '200px';
        imageElement.style.height = '200px';
  
        nftElement.textContent = `NFT ID: ${tokenId.toString()}`;
        nftElement.appendChild(imageElement);
        nftListElement.appendChild(nftElement);
      }
    } else {
      console.log('MetaMask no está instalado');
    }
  }
  
  // Manejador de evento para el botón de conexión a MetaMask
  document.getElementById('connectButton').addEventListener('click', () => {
    obtenerNFTs();
  });
  