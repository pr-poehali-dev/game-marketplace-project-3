import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  inStock: boolean;
  seller: string;
  sellerRating: number;
}

interface CartItem extends Product {
  quantity: number;
}

const INITIAL_PRODUCTS: Product[] = [];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [balance, setBalance] = useState(10000);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'GamerPro',
    email: 'gamer@cyber.market',
    joinDate: '2024',
    totalSales: 0,
    totalPurchases: 0,
    reputation: 4.9
  });
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    image: ''
  });

  const categories = ['Все', 'Игры PC', 'Игры Console', 'Мобильные игры', 'Внутриигровые предметы', 'Игровая валюта', 'Буст услуги', 'Gaming оборудование', 'Аксессуары', 'Стримерские товары', 'Коллекционные предметы'];

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const checkout = () => {
    const total = getTotalPrice();
    if (total <= balance) {
      setBalance(balance - total);
      setUserProfile({...userProfile, totalPurchases: userProfile.totalPurchases + getTotalItems()});
      setCart([]);
      alert('Покупка совершена успешно! 🎉');
    } else {
      alert('Недостаточно средств на балансе 😞');
    }
  };

  const addProduct = () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category || !newProduct.description) {
      alert('Заполните все поля!');
      return;
    }

    const product: Product = {
      id: Date.now(),
      title: newProduct.title,
      price: parseInt(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.image || `/img/29e667f3-99c7-469a-aac6-ac7f5397b77c.jpg`,
      rating: 5.0,
      inStock: true,
      seller: 'Вы',
      sellerRating: 4.9
    };

    setProducts([...products, product]);
    setUserProfile({...userProfile, totalSales: userProfile.totalSales + 1});
    setNewProduct({ title: '', price: '', category: '', description: '', image: '' });
    setIsAddProductOpen(false);
    alert('Товар успешно добавлен! 🎉');
  };

  const getProductImage = (product: Product, index: number) => {
    const images = [
      '/img/29e667f3-99c7-469a-aac6-ac7f5397b77c.jpg',
      '/img/756b7e68-11f7-494f-bf7e-1b3fa863dc92.jpg', 
      '/img/d7adacaf-52bd-49a6-bbdc-3dfd158a7d9f.jpg'
    ];
    return product.image || images[index % images.length];
  };

  return (
    <div className="min-h-screen bg-dark-bg relative overflow-hidden">
      {/* Cyberpunk scan line */}
      <div className="scan-line"></div>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-card/95 backdrop-blur-sm border-b border-cyberpunk-yellow/30 hologram">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-cyber glitch-text animate-flicker">
                CYBER MARKET
              </h1>
              <Badge variant="secondary" className="bg-cyberpunk-pink text-white animate-pulse-slow">
                2077
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Balance */}
              <div className="flex items-center space-x-2 bg-dark-panel px-4 py-2 rounded-cyber cyber-border">
                <Icon name="Wallet" size={20} className="text-cyberpunk-yellow animate-pulse" />
                <span className="font-cyber text-cyberpunk-yellow">
                  {balance.toLocaleString()} ¥
                </span>
              </div>

              {/* Add Product */}
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="cyber-button">
                    <Icon name="Plus" size={16} className="mr-2" />
                    SELL ITEM
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-dark-card cyber-border text-dark-text hologram">
                  <DialogHeader>
                    <DialogTitle className="text-cyberpunk-yellow font-cyber glitch-text">ADD ITEM</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Заполните информацию о вашем товаре
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Название товара</Label>
                      <Input
                        id="title"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                        className="bg-gaming-light border-gaming-gray text-white"
                        placeholder="Введите название"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-white">Цена (₽)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        className="bg-gaming-light border-gaming-gray text-white"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-white">Категория</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger className="bg-gaming-light border-gaming-gray text-white">
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent className="bg-gaming-dark border-gaming-gray">
                          {categories.slice(1).map(cat => (
                            <SelectItem key={cat} value={cat} className="text-dark-text hover:bg-dark-panel">{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white">Описание</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        className="bg-gaming-light border-gaming-gray text-white"
                        placeholder="Опишите ваш товар"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image" className="text-white">Ссылка на изображение (необязательно)</Label>
                      <Input
                        id="image"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                        className="bg-gaming-light border-gaming-gray text-white"
                        placeholder="https://..."
                      />
                    </div>
                    <Button 
                      onClick={addProduct}
                      className="w-full bg-neon-green text-black hover:bg-neon-green/80 font-orbitron"
                    >
                      DEPLOY ITEM
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Cart */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative cyber-border bg-dark-panel hover:bg-dark-card">
                    <Icon name="ShoppingCart" size={20} />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-cyberpunk-pink text-white text-xs animate-pulse">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-dark-card cyber-border hologram">
                  <SheetHeader>
                    <SheetTitle className="text-cyberpunk-yellow font-cyber glitch-text">
                      Корзина
                    </SheetTitle>
                    <SheetDescription className="text-dark-text/70">
                      Your selected items
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-dark-text/70 text-center py-8 font-cyber">
                        CART EMPTY
                      </p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-dark-panel rounded-cyber cyber-border">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={getProductImage(item, 0)}
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-cyber text-cyberpunk-yellow">{item.title}</p>
                                <p className="text-sm text-dark-text/70">{item.price.toLocaleString()} ¥</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                -
                              </Button>
                              <span className="text-cyberpunk-yellow w-8 text-center font-cyber">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="border-t border-gray-600 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-cyber text-lg text-dark-text">TOTAL:</span>
                            <span className="font-cyber text-xl text-cyberpunk-yellow glitch-text">
                              {getTotalPrice().toLocaleString()} ¥
                            </span>
                          </div>
                          <Button 
                            onClick={checkout}
                            className="w-full cyber-button font-cyber"
                            disabled={getTotalPrice() > balance}
                          >
                            {getTotalPrice() > balance ? 'INSUFFICIENT FUNDS' : 'PURCHASE'}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Profile */}
              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogTrigger asChild>
                  <Avatar className="cursor-pointer hover:ring-2 hover:ring-cyberpunk-yellow transition-all cyber-glow">
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback className="bg-cyberpunk-pink text-white font-cyber">GT</AvatarFallback>
                  </Avatar>
                </DialogTrigger>
                <DialogContent className="bg-dark-card cyber-border text-dark-text max-w-md hologram">
                  <DialogHeader>
                    <DialogTitle className="text-cyberpunk-yellow font-cyber glitch-text">USER PROFILE</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Управление профилем и настройками
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Profile Info */}
                    <div className="flex items-center space-x-4 p-4 bg-gaming-light rounded-lg">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src="/api/placeholder/64/64" />
                        <AvatarFallback className="bg-cyberpunk-pink text-white text-xl font-cyber">GT</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-cyber text-cyberpunk-yellow text-lg">{userProfile.name}</h3>
                        <p className="text-dark-text/70 text-sm">{userProfile.email}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Icon name="Star" size={14} className="text-cyberpunk-yellow fill-current animate-pulse" />
                          <span className="text-sm text-dark-text/70">{userProfile.reputation} RATING</span>
                        </div>
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="p-4 bg-gaming-light rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-dark-text/70 font-cyber">BALANCE</span>
                        <Button 
                          size="sm" 
                          className="cyber-button text-xs"
                        >
                          TOP UP
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Wallet" size={20} className="text-cyberpunk-yellow animate-pulse" />
                        <span className="font-cyber text-xl text-cyberpunk-yellow glitch-text">
                          {balance.toLocaleString()} ¥
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gaming-light rounded-lg text-center">
                        <div className="text-lg font-orbitron text-neon-green">{userProfile.totalSales}</div>
                        <div className="text-xs text-gray-400">Продано</div>
                      </div>
                      <div className="p-3 bg-gaming-light rounded-lg text-center">
                        <div className="text-lg font-orbitron text-neon-pink">{userProfile.totalPurchases}</div>
                        <div className="text-xs text-gray-400">Куплено</div>
                      </div>
                    </div>

                    {/* Profile Settings */}
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="profile-name" className="text-dark-text text-sm font-cyber">USERNAME</Label>
                        <Input
                          id="profile-name" 
                          value={userProfile.name}
                          onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                          className="bg-gaming-light border-gaming-gray text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profile-email" className="text-dark-text text-sm font-cyber">EMAIL</Label>
                        <Input
                          id="profile-email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                          className="bg-gaming-light border-gaming-gray text-white mt-1"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 cyber-button font-cyber"
                        onClick={() => alert('PROFILE SAVED! 💾')}
                      >
                        SAVE
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 cyber-border text-cyberpunk-yellow bg-dark-panel hover:bg-dark-card font-cyber"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        CLOSE
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-dark-card via-dark-bg to-dark-panel hologram">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-cyber font-bold text-dark-text mb-4 glitch-text">
            CYBER <span className="text-cyberpunk-yellow animate-flicker">MARKETPLACE</span>
          </h2>
          <p className="text-xl text-dark-text/80 mb-8 max-w-2xl mx-auto font-cyber">
            PREMIUM GAMES, RARE ITEMS & PROFESSIONAL SERVICES FOR GAMERS
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="cyber-button font-cyber mr-4">
              START SHOPPING
            </Button>
            <Button variant="outline" className="cyber-border text-cyberpunk-yellow bg-dark-panel hover:bg-dark-card font-cyber">
              CATALOG
            </Button>
          </div>
        </div>
      </section>

      {/* Categories & Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-dark-panel border border-cyberpunk-yellow/30 flex-wrap hologram">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-dark-text/70 data-[state=active]:text-cyberpunk-yellow data-[state=active]:bg-dark-card text-xs font-cyber"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={selectedCategory} className="space-y-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Package" size={64} className="text-cyberpunk-yellow/50 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-cyber text-cyberpunk-yellow/70 mb-2 glitch-text">NO ITEMS FOUND</h3>
                  <p className="text-dark-text/50 mb-4 font-cyber">BE THE FIRST TO ADD ITEMS TO THIS CATEGORY!</p>
                  <Button 
                    onClick={() => setIsAddProductOpen(true)}
                    className="bg-neon-green text-black hover:bg-neon-green/80 font-orbitron"
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    ADD ITEM
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <Card key={product.id} className="cyber-card border-dark-border">
                      <CardHeader className="pb-4">
                        <div className="relative mb-4">
                          <img 
                            src={getProductImage(product, index)}
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Badge 
                            variant={product.inStock ? "default" : "destructive"}
                            className={`absolute top-2 right-2 font-cyber ${product.inStock ? "bg-cyberpunk-green text-black animate-pulse" : ""}`}
                          >
                            {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
                          </Badge>
                        </div>
                        <CardTitle className="text-cyberpunk-yellow font-cyber glitch-text">
                          {product.title}
                        </CardTitle> 
                        <CardDescription className="text-dark-text/70">
                          {product.description}
                        </CardDescription>
                        <div className="flex items-center space-x-2 mt-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-cyberpunk-pink text-white text-xs font-cyber">
                              {product.seller[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-dark-text/70 font-cyber">{product.seller}</span>
                          <div className="flex items-center space-x-1">
                            <Icon name="Star" size={12} className="text-cyberpunk-yellow fill-current animate-pulse" />
                            <span className="text-xs text-dark-text/70">{product.sellerRating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Icon 
                                key={i}
                                name="Star" 
                                size={16} 
                                className={i < Math.floor(product.rating) ? "text-cyberpunk-yellow fill-current animate-pulse" : "text-dark-text/30"}
                              />
                            ))}
                            <span className="text-sm text-dark-text/70 ml-2">{product.rating}</span>
                          </div>
                          <Badge variant="secondary" className="bg-dark-panel text-cyberpunk-pink font-cyber">
                            {product.category}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-cyber text-cyberpunk-yellow glitch-text">
                            {product.price.toLocaleString()} ¥
                          </span>
                          <Button 
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className="cyber-button font-cyber"
                          >
                            <Icon name="Plus" size={16} className="mr-2" />
                            ADD TO CART
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-bg border-t border-cyberpunk-yellow/30 py-8 hologram">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-cyber text-cyberpunk-yellow mb-4 glitch-text animate-flicker">CYBER MARKET</div>
          <p className="text-dark-text/70 mb-4 font-cyber">
            THE GAMING MARKETPLACE OF THE FUTURE
          </p>
          <div className="flex justify-center space-x-6">
            <Icon name="Facebook" size={24} className="text-dark-text/50 hover:text-cyberpunk-yellow cursor-pointer transition-all hover:animate-pulse" />
            <Icon name="Twitter" size={24} className="text-dark-text/50 hover:text-cyberpunk-blue cursor-pointer transition-all hover:animate-pulse" />
            <Icon name="Instagram" size={24} className="text-dark-text/50 hover:text-cyberpunk-pink cursor-pointer transition-all hover:animate-pulse" />
            <Icon name="Youtube" size={24} className="text-dark-text/50 hover:text-cyberpunk-red cursor-pointer transition-all hover:animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
}