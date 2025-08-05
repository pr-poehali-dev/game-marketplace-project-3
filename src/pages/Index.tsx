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
  const [balance, setBalance] = useState(50000);
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
    <div className="min-h-screen bg-gaming-darker">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gaming-dark/95 backdrop-blur-sm border-b border-neon-green/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-orbitron font-bold text-neon-green">
                CYBER MARKET
              </h1>
              <Badge variant="secondary" className="bg-neon-pink text-white">
                BETA
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Balance */}
              <div className="flex items-center space-x-2 bg-gaming-light px-3 py-2 rounded-lg">
                <Icon name="Wallet" size={20} className="text-neon-green" />
                <span className="font-orbitron text-white">
                  {balance.toLocaleString()} ₽
                </span>
              </div>

              {/* Add Product */}
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-neon-pink text-white hover:bg-neon-pink/80">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Продать товар
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gaming-dark border-neon-green/20 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-neon-green font-orbitron">Добавить товар</DialogTitle>
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
                            <SelectItem key={cat} value={cat} className="text-white hover:bg-gaming-light">{cat}</SelectItem>
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
                      Добавить товар
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Cart */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative neon-border">
                    <Icon name="ShoppingCart" size={20} />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-neon-pink text-white text-xs">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-gaming-dark border-neon-green/20">
                  <SheetHeader>
                    <SheetTitle className="text-neon-green font-orbitron">
                      Корзина
                    </SheetTitle>
                    <SheetDescription className="text-gray-400">
                      Ваши товары к покупке
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        Корзина пуста
                      </p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gaming-light rounded-lg">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={getProductImage(item, 0)}
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium text-white">{item.title}</p>
                                <p className="text-sm text-gray-400">{item.price.toLocaleString()} ₽</p>
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
                              <span className="text-white w-8 text-center">{item.quantity}</span>
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
                            <span className="font-orbitron text-lg text-white">Итого:</span>
                            <span className="font-orbitron text-xl text-neon-green">
                              {getTotalPrice().toLocaleString()} ₽
                            </span>
                          </div>
                          <Button 
                            onClick={checkout}
                            className="w-full bg-neon-green text-black hover:bg-neon-green/80 font-orbitron"
                            disabled={getTotalPrice() > balance}
                          >
                            {getTotalPrice() > balance ? 'Недостаточно средств' : 'Купить'}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Profile */}
              <Avatar>
                <AvatarImage src="/api/placeholder/40/40" />
                <AvatarFallback className="bg-neon-pink text-white">GT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-gaming-dark via-gaming-darker to-gaming-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4">
            ИГРОВОЙ <span className="text-neon-green">МАРКЕТПЛЕЙС</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Лучшие игры, редкие предметы и профессиональные услуги для геймеров
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-neon-green text-black hover:bg-neon-green/80 font-orbitron">
              Начать покупки
            </Button>
            <Button variant="outline" className="neon-border text-neon-green">
              Каталог
            </Button>
          </div>
        </div>
      </section>

      {/* Categories & Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-gaming-light border border-gaming-gray flex-wrap">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-gray-300 data-[state=active]:text-neon-green data-[state=active]:bg-gaming-dark text-xs"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={selectedCategory} className="space-y-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="Package" size={64} className="text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-orbitron text-gray-400 mb-2">Пока нет товаров</h3>
                  <p className="text-gray-500 mb-4">Станьте первым, кто добавит товар в эту категорию!</p>
                  <Button 
                    onClick={() => setIsAddProductOpen(true)}
                    className="bg-neon-green text-black hover:bg-neon-green/80 font-orbitron"
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить товар
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <Card key={product.id} className="gaming-card border-gaming-gray">
                      <CardHeader className="pb-4">
                        <div className="relative mb-4">
                          <img 
                            src={getProductImage(product, index)}
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Badge 
                            variant={product.inStock ? "default" : "destructive"}
                            className={`absolute top-2 right-2 ${product.inStock ? "bg-neon-green text-black" : ""}`}
                          >
                            {product.inStock ? "В наличии" : "Нет в наличии"}
                          </Badge>
                        </div>
                        <CardTitle className="text-white font-orbitron">
                          {product.title}
                        </CardTitle> 
                        <CardDescription className="text-gray-400">
                          {product.description}
                        </CardDescription>
                        <div className="flex items-center space-x-2 mt-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-neon-pink text-white text-xs">
                              {product.seller[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-400">{product.seller}</span>
                          <div className="flex items-center space-x-1">
                            <Icon name="Star" size={12} className="text-neon-green fill-current" />
                            <span className="text-xs text-gray-400">{product.sellerRating}</span>
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
                                className={i < Math.floor(product.rating) ? "text-neon-green fill-current" : "text-gray-600"}
                              />
                            ))}
                            <span className="text-sm text-gray-400 ml-2">{product.rating}</span>
                          </div>
                          <Badge variant="secondary" className="bg-gaming-light text-neon-pink">
                            {product.category}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-orbitron text-neon-green">
                            {product.price.toLocaleString()} ₽
                          </span>
                          <Button 
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className="bg-neon-green text-black hover:bg-neon-green/80 font-orbitron"
                          >
                            <Icon name="Plus" size={16} className="mr-2" />
                            В корзину
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
      <footer className="bg-gaming-darker border-t border-gaming-gray py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-orbitron text-neon-green mb-4">CYBER MARKET</div>
          <p className="text-gray-400 mb-4">
            Твой гейминг-магазин будущего
          </p>
          <div className="flex justify-center space-x-6">
            <Icon name="Facebook" size={24} className="text-gray-400 hover:text-neon-green cursor-pointer" />
            <Icon name="Twitter" size={24} className="text-gray-400 hover:text-neon-green cursor-pointer" />
            <Icon name="Instagram" size={24} className="text-gray-400 hover:text-neon-green cursor-pointer" />
            <Icon name="Youtube" size={24} className="text-gray-400 hover:text-neon-green cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}