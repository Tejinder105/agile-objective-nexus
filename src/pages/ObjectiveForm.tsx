
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Calendar, Save } from "lucide-react";

export default function ObjectiveForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [objective, setObjective] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "",
    due_date: "",
    progress: 0,
    status: "Not Started"
  });

  useEffect(() => {
    if (isEditing) {
      fetchObjective();
    }
  }, [id]);

  const fetchObjective = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('objectives')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Format the date to YYYY-MM-DD for the input
        const formattedDate = data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : '';
        
        setObjective({
          ...data,
          due_date: formattedDate
        });
      }
    } catch (error) {
      console.error('Error fetching objective:', error);
      toast({
        title: "Error",
        description: "Failed to load objective data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setObjective(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setObjective(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get user ID from session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to create or edit objectives");
      }
      
      const userId = session.user.id;
      
      // Prepare data
      const objectiveData = {
        ...objective,
        user_id: userId,
        progress: parseInt(String(objective.progress)),
      };
      
      if (isEditing) {
        // Update existing objective
        const { error } = await supabase
          .from('objectives')
          .update(objectiveData)
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Objective updated successfully",
        });
      } else {
        // Insert new objective
        const { error } = await supabase
          .from('objectives')
          .insert([objectiveData]);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Objective created successfully",
        });
      }
      
      // Navigate back to objectives page
      navigate("/objectives");
    } catch (error) {
      console.error('Error saving objective:', error);
      toast({
        title: "Error",
        description: "Failed to save objective",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/objectives")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{isEditing ? 'Edit Objective' : 'Create Objective'}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Objective Details' : 'New Objective'}</CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Update your objective information below' 
              : 'Fill in the details to create a new objective'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                name="title" 
                value={objective.title} 
                onChange={handleChange} 
                placeholder="Enter objective title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={objective.description || ''} 
                onChange={handleChange} 
                placeholder="Describe your objective"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={objective.priority || 'Medium'} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  name="category" 
                  value={objective.category || ''} 
                  onChange={handleChange} 
                  placeholder="e.g. Career, Personal"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="due_date" 
                    name="due_date" 
                    type="date" 
                    value={objective.due_date || ''} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={objective.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="progress">Progress ({objective.progress}%)</Label>
              <Input 
                id="progress" 
                name="progress" 
                type="range" 
                min="0" 
                max="100" 
                value={objective.progress} 
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/objectives")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Objective'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
